const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ==============================================
// ✅ 1. SIGNUP - Registration (Customer or Provider)
// ==============================================
exports.signup = async (req, res) => {
  try {
    const {
      Full_Name,
      Email,
      Password,
      Role,
      Address,
      City,
      phone_number,
      profileImage,
      services,
    } = req.body;

    // التحقق من البيانات الأساسية
    if (!Full_Name || !Email || !Password || !Role) {
      return res.status(400).json({
        success: false,
        message: "Full_Name, Email, Password and Role required",
      });
    }

    // التحقق من وجود البريد الإلكتروني
    const [exist] = await pool.query(
      "SELECT Users_id FROM users WHERE LOWER(Email)=LOWER(?)",
      [Email],
    );
    if (exist.length) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    let roleId;
    let accountStatus = "Approved";
    const roleLower = Role.toLowerCase();

    if (roleLower === "customer") {
      roleId = 3;
      accountStatus = "active";
    } else if (roleLower === "provider") {
      roleId = 4;
      accountStatus = "Pending";
    } else if (roleLower === "admin") {
      roleId = 1;
      accountStatus = "active";
    } else if (roleLower === "admin_user") {
      roleId = 2;
      accountStatus = "active";
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid role",
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(Password, 10);

    // إدراج المستخدم
    const [result] = await pool.query(
      `INSERT INTO users
       (Full_Name, Email, Password, role_id, Address, City, phone_number, profile_image, account_status)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        Full_Name,
        Email,
        hashedPassword,
        roleId,
        Address || null,
        City || null,
        phone_number || null,
        profileImage || null,
        accountStatus,
      ],
    );
    const userId = result.insertId;

    // إذا كان مقدم خدمة (Provider)
    if (roleLower === "provider" && services && services.length) {
      // التحقق من وجود خدمات
      if (!services || !services.length) {
        return res.status(400).json({
          success: false,
          message: "At least one service is required for provider registration",
        });
      }

      // معالجة كل خدمة
      for (let service of services) {
        // التحقق من البيانات المطلوبة للخدمة
        if (!service.service_id || !service.prices || !service.prices.length) {
          return res.status(400).json({
            success: false,
            message:
              "Each service must have service_id and at least one price type",
          });
        }

        // التحقق من max price لكل نوع سعر
        for (let price of service.prices) {
          const [pricing] = await pool.query(
            `SELECT max_price FROM service_pricing_types
             WHERE service_id = ? AND pricing_type = ? AND enabled = 1`,
            [service.service_id, price.type],
          );

          if (
            pricing.length &&
            parseFloat(price.price) > parseFloat(pricing[0].max_price)
          ) {
            return res.status(400).json({
              success: false,
              message: `Price for service ${service.service_id} (${price.type}) exceeds max price of ${pricing[0].max_price}`,
            });
          }
        }

        // Ensure availability is always a valid JSON string
        let availabilityData = null;
        if (service.availability) {
          if (typeof service.availability === "object") {
            availabilityData = JSON.stringify(service.availability);
          } else if (typeof service.availability === "string") {
            try {
              JSON.parse(service.availability);
              availabilityData = service.availability;
            } catch (e) {
              availabilityData = JSON.stringify(service.availability);
            }
          }
        }

        const [psResult] = await pool.query(
          `INSERT INTO provider_services
           (provider_id, service_id, description, availability, service_image, status, approval_status)
           VALUES (?, ?, ?, ?, ?, 'Pending', 'Pending')`,
          [
            userId,
            service.service_id,
            service.description || null,
            availabilityData,
            service.serviceImage || profileImage || null,
          ],
        );

        const providerServiceId = psResult.insertId;

        // إدراج الصورة الأساسية (service_image)
        if (service.serviceImage) {
          await pool.query(
            `INSERT INTO provider_service_images
             (provider_service_id, image_url, is_primary)
             VALUES (?, ?, ?)`,
            [providerServiceId, service.serviceImage, 1],
          );
        }

        // إدراج صور المعرض (Gallery)
        if (service.galleryImages && Array.isArray(service.galleryImages)) {
          for (let imgUrl of service.galleryImages) {
            await pool.query(
              `INSERT INTO provider_service_images
               (provider_service_id, image_url, is_primary)
               VALUES (?, ?, ?)`,
              [providerServiceId, imgUrl, 0],
            );
          }
        }

        // إدراج الأسعار
        if (service.prices && Array.isArray(service.prices)) {
          for (let price of service.prices) {
            await pool.query(
              `INSERT INTO provider_service_prices
               (provider_service_id, pricing_type, price)
               VALUES (?, ?, ?)`,
              [providerServiceId, price.pricing_type || price.type, price.price],
            );
          }
        }
      }
    }
     const notificationMsg = `New provider signup: ${Full_Name} has registered and awaiting approval`;
      await pool.query(
        `INSERT INTO notifications (user_id, message, type, is_read) 
        VALUES (?, ?, ?, 0)`,
        [1, notificationMsg, 'ProviderSignup'] 
      );


      const io = req.app.get("io");
      if (roleLower === "provider" && io) {
        io.emit("new_provider_registered", {
          message: notificationMsg,
          providerId: userId,
          type: "ProviderSignup",
          timestamp: new Date()
        });
      }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================================
// ✅ 2. LOGIN
// ==============================================
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE Email=?AND is_deleted = 0", [Email]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const status = user.account_status?.trim();

    // التحقق من حالة الحساب (يسمح بدخول Active و Approved)
    const allowedStatuses = ["Active", "Approved", "active", "approved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(403).json({
        success: false,
        message: `Account is ${status}. Access denied.`,
      });
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Wrong password" });
    }

    // إنشاء JWT token
    const token = jwt.sign(
      { id: user.Users_id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.Users_id,
        name: user.Full_Name,
        role: user.role_id,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================================
// ✅ 3. LOGOUT
// ==============================================
exports.logout = async (req, res) => {
  try {
    // In JWT, logout is handled by the frontend by deleting the token
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error during logout: " + err.message,
    });
  }
};

// ==============================================
// ✅ 4. GET USERS
// ==============================================
exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT
        Users_id,
        Full_Name,
        Email,
        role_id,
        account_status,
        City,
        phone_number,
        profile_image
      FROM users
      WHERE is_deleted = 0`,
    );

    return res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================================
// ✅ 5. UPDATE USER
// ==============================================
exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    const { Full_Name, Password, Address, City, phone_number, account_status } = req.body;

    let updates = [];
    let values = [];

    if (Full_Name) {
      updates.push("Full_Name=?");
      values.push(Full_Name);
    }

    if (Password) {
      const hashed = await bcrypt.hash(Password, 10);
      updates.push("Password=?");
      values.push(hashed);
    }

    if (Address) {
      updates.push("Address=?");
      values.push(Address);
    }

    if (City) {
      updates.push("City=?");
      values.push(City);
    }

    if (phone_number) {
      updates.push("phone_number=?");
      values.push(phone_number);
    }

    if (account_status) {
      let dbStatus =
        account_status === "in active"
          ? "inactive"
          : account_status === "active"
            ? "active"
            : account_status;
      updates.push("account_status=?");
      values.push(dbStatus);
    }

    if (!updates.length) {
      return res.status(400).json({
        success: false,
        message: "No data to update",
      });
    }

    const sql = `UPDATE users SET ${updates.join(",")} WHERE Users_id=?`;
    values.push(id);

    const [result] = await pool.query(sql, values);

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================================
// ✅ 6. DELETE USER (Soft Delete)
// ==============================================
exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const [user] = await pool.query(
      "SELECT role_id FROM users WHERE Users_id=?",
      [id],
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user[0].role_id === 1) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot be deleted",
      });
    }

    await pool.query("UPDATE users SET is_deleted=1 WHERE Users_id=?", [id]);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================================
// ✅ 7. APPROVE PROVIDER
// ==============================================
exports.approveProvider = async (req, res) => {
  try {
    const id = req.params.id;

    const [user] = await pool.query(
      "SELECT * FROM users WHERE Users_id=? AND role_id=4",
      [id],
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    await pool.query(
      "UPDATE users SET account_status='active' WHERE Users_id=?",
      [id],
    );

    return res.json({
      success: true,
      message: "Provider approved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================================
// ✅ 8. REJECT PROVIDER
// ==============================================
exports.rejectProvider = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query(
      "UPDATE users SET account_status='Rejected' WHERE Users_id=?",
      [id],
    );

    return res.json({
      success: true,
      message: "Provider rejected",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================================
// ✅ 9. GET PENDING PROVIDERS
// ==============================================
exports.getPendingProviders = async (req, res) => {
  try {
    const [providers] = await pool.query(
      `SELECT Users_id, Full_Name, Email, City, phone_number
       FROM users
       WHERE role_id = 4
       AND account_status = 'Pending'`,
    );

    res.json({
      success: true,
      data: providers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

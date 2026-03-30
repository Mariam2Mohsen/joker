const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.signup = async (req, res) => {
  try {
    const { Full_Name, Email, Password, Role, Address, City, phone_number } =
      req.body;

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
    let accountStatus = "approved";
    const roleLower = Role.toLowerCase();

    if (roleLower === "customer") {
      roleId = 3;
      accountStatus = "active";
    } else if (roleLower === "provider") {
      roleId = 4;
      accountStatus = "pending";
    }  
    else if (roleLower === "admin") {
      roleId = 1;
      accountStatus = "active";
    } else if (roleLower === "admin_user") {
      roleId = 2;
      accountStatus = "active";
    }else {
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
       (Full_Name, Email, Password, role_id, Address, City, phone_number, account_status)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        Full_Name,
        Email,
        hashedPassword,
        roleId,
        Address || null,
        City || null,
        phone_number || null,
        accountStatus,
      ],
    );
    const userId = result.insertId;

    // إذا كان مقدم خدمة
    if (roleLower === "provider") {
      const { services } = req.body; // services: array من الخدمات

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

        // إدراج الخدمة في provider_services
        const [psResult] = await pool.query(
          `INSERT INTO provider_services
           (provider_id, service_id, description, availability, service_image, status)
           VALUES (?, ?, ?, ?, ?, 'pending')`,
          [
            userId,
            service.service_id,
            service.description || null,
            service.availability || null,
            service.serviceImage || null,
          ],
        );

        const providerServiceId = psResult.insertId;

        // إدراج الأسعار لكل نوع
        for (let price of service.prices) {
          await pool.query(
            `INSERT INTO provider_service_prices
             (provider_service_id, pricing_type, pricing)
             VALUES (?, ?, ?)`,
            [providerServiceId, price.type, price.price],
          );
        }
      }
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

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE Email=?", [
      Email,
    ]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const status = user.account_status?.trim().toLowerCase();

  
    if (status !== "active" && status !== "approved") {
      return res
        .status(403)
        .json({ success: false, message: `Account is ${status}` });
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong password" });
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
        phone_number
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

exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    const {
      Full_Name,
      Password,
      Role,
      Address,
      City,
      phone_number,
      account_status,
    } = req.body;

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

    if (Role) {
      let roleId;
      const roleLower = Role.toLowerCase();

      if (roleLower === "admin") roleId = 1;
      else if (roleLower === "admin_user") roleId = 2;
      else if (roleLower === "customer") roleId = 3;
      else if (roleLower === "provider") roleId = 4;
      else {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      updates.push("role_id=?");
      values.push(roleId);
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
      updates.push("account_status=?");
      values.push(account_status);
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

    // تعيين حالة الحساب إلى active للسماح بتسجيل الدخول
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

exports.rejectProvider = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query(
      "UPDATE users SET account_status='rejected' WHERE Users_id=?",
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

exports.getPendingProviders = async (req, res) => {
  try {
    const [providers] = await pool.query(
      `SELECT Users_id, Full_Name, Email, City, phone_number
       FROM users
       WHERE role_id = 4
       AND account_status = 'pending'`,
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

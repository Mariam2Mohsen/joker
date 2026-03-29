const pool = require("../config/db");

// ✅ Add Service
exports.addService = async (req, res) => {
  try {
    const {
      name,
      category_id,
      sub_category_id,
      commission_type,
      commission_value,
      discount,
      status, // Active / Inactive
      pricing,
    } = req.body;

    if (
      !name ||
      !category_id ||
      !sub_category_id ||
      !commission_type ||
      discount === undefined ||
      !commission_value ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, category_id, sub_category_id, commission_type, discount, commission_value, status",
      });
    }

    // insert service
    const [result] = await pool.query(
      `INSERT INTO services 
      (name, category_id, sub_category_id, commission_type, discount, commission_value, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category_id,
        sub_category_id,
        commission_type,
        discount,
        commission_value,
        status,
      ],
    );

    const serviceId = result.insertId;

    // insert pricing
    if (pricing && pricing.length) {
      for (let p of pricing) {
        await pool.query(
          `INSERT INTO service_pricing_types 
          (service_id, pricing_type, max_price, enabled)
          VALUES (?, ?, ?, ?)`,
          [serviceId, p.type, p.max_price, p.enabled ?? 1],
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Service created",
      serviceId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Get All Services
exports.getServices = async (req, res) => {
  try {
    const [services] = await pool.query(`
      SELECT s.*, c.name AS category_name, sc.name AS sub_category_name
      FROM services s
      LEFT JOIN categories c ON s.category_id = c.category_id
      LEFT JOIN sub_categories sc ON s.sub_category_id = sc.sub_category_id
      ORDER BY s.service_id DESC
    `);

    for (let service of services) {
      const [pricing] = await pool.query(
        `SELECT pricing_type, max_price, enabled 
         FROM service_pricing_types 
         WHERE service_id=?`,
        [service.service_id],
      );

      service.pricing = pricing;
    }

    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Get Single Service
exports.getServiceById = async (req, res) => {
  try {
    const id = req.params.id;
    
    const [services] = await pool.query(
      `SELECT s.*, c.name AS category_name, sc.name AS sub_category_name
       FROM services s
       LEFT JOIN categories c ON s.category_id = c.category_id
       LEFT JOIN sub_categories sc ON s.sub_category_id = sc.sub_category_id
       WHERE s.service_id = ?`,
      [id]
    );

    if (!services.length) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const [pricing] = await pool.query(
      `SELECT pricing_type, max_price, enabled 
       FROM service_pricing_types 
       WHERE service_id=?`,
      [id],
    );

    services[0].pricing = pricing;

    res.json({
      success: true,
      data: services[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Update Service (All fields optional)
exports.updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      category_id,
      sub_category_id,
      commission_type,
      commission_value,
      discount,
      status, // Active / Inactive
      pricing,
    } = req.body;

    // First, check if service exists
    const [existing] = await pool.query(
      `SELECT service_id FROM services WHERE service_id = ?`,
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (category_id !== undefined) {
      updates.push("category_id = ?");
      values.push(category_id);
    }
    if (sub_category_id !== undefined) {
      updates.push("sub_category_id = ?");
      values.push(sub_category_id);
    }
    if (commission_type !== undefined) {
      updates.push("commission_type = ?");
      values.push(commission_type);
    }
    if (commission_value !== undefined) {
      updates.push("commission_value = ?");
      values.push(commission_value);
    }
    if (discount !== undefined) {
      updates.push("discount = ?");
      values.push(discount);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    // Update service if there are changes
    if (updates.length) {
      values.push(id);
      await pool.query(
        `UPDATE services SET ${updates.join(", ")} WHERE service_id = ?`,
        values,
      );
    }

    // Update pricing if provided
    if (pricing !== undefined) {
      // Delete old pricing
      await pool.query(`DELETE FROM service_pricing_types WHERE service_id=?`, [id]);

      // Insert new pricing
      if (pricing && pricing.length) {
        for (let p of pricing) {
          await pool.query(
            `INSERT INTO service_pricing_types 
            (service_id, pricing_type, max_price, enabled)
            VALUES (?, ?, ?, ?)`,
            [id, p.type, p.max_price, p.enabled ?? 1],
          );
        }
      }
    }

    res.json({
      success: true,
      message: "Service updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Delete Service
exports.deleteService = async (req, res) => {
  try {
    const id = req.params.id;

    // 1️⃣ Check if service exists
    const [existing] = await pool.query(
      `SELECT service_id FROM services WHERE service_id = ?`,
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // 2️⃣ Check for active bookings linked to this service
    const [activeBookings] = await pool.query(
      `SELECT b.booking_id 
       FROM bookings b
       JOIN provider_services ps ON b.provider_service_id = ps.id
       WHERE ps.service_id = ? 
       AND b.status IN ('pending', 'accepted', 'in_progress')`,
      [id],
    );

    if (activeBookings.length) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete service: there are active bookings",
      });
    }

    // 3️⃣ Delete pricing first to avoid FK errors
    await pool.query("DELETE FROM service_pricing_types WHERE service_id=?", [id]);

    // 4️⃣ Delete the service
    await pool.query("DELETE FROM services WHERE service_id=?", [id]);

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Change Status
exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // Active / Inactive

    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'Active' or 'Inactive'",
      });
    }

    const [result] = await pool.query(
      "UPDATE services SET status=? WHERE service_id=?",
      [status, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: `Service status updated to ${status}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPendingServiceRequests = async (req, res) => {
  try {
    const [requests] = await pool.query( 
      `SELECT sr.request_id, sr.provider_id, sr.service_name, 
              sr.category_id, sr.sub_category_id, sr.status, sr.created_at,
              u.Full_Name AS provider_name, u.Email AS provider_email,
              c.name AS category_name, sc.name AS sub_category_name
       FROM service_requests sr
       JOIN users u ON sr.provider_id = u.Users_id
       LEFT JOIN categories c ON sr.category_id = c.category_id
       LEFT JOIN sub_categories sc ON sr.sub_category_id = sc.sub_category_id
       WHERE sr.status = 'Pending'
       ORDER BY sr.created_at DESC`,
    );

    // جلب تفاصيل الأسعار لكل طلب
    for (let request of requests) {
      // جلب provider_service المرتبط بهذا الطلب
      const [services] = await pool.query(
        `SELECT ps.id, ps.description, ps.availability,
                psp.pricing_type, psp.price
         FROM provider_services ps
         LEFT JOIN provider_service_prices psp ON ps.id = psp.provider_service_id
         WHERE ps.request_id = ?`,
        [request.request_id],
      );

      if (services.length) {
        const prices = services
          .filter(s => s.pricing_type && s.price)
          .map(s => ({ type: s.pricing_type, price: s.price }));
        
        request.service_details = {
          description: services[0].description,
          availability: services[0].availability,
          prices: prices,
        };
      }
    }

    res.json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ موافقة Admin على طلب خدمة
exports.approveServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // 1. التحقق من وجود الطلب
    const [request] = await pool.query(
      `SELECT * FROM service_requests WHERE request_id = ? AND status = 'Pending'`,
      [requestId],
    );

    if (!request.length) {
      return res.status(404).json({
        success: false,
        message: "Service request not found or already processed",
      });
    }

    // 2. تحديث حالة الطلب
    await pool.query(
      `UPDATE service_requests SET status = 'Approved' WHERE request_id = ?`,
      [requestId],
    );

    // 3. تحديث حالة provider_services المرتبطة
    const [providerServices] = await pool.query(
      `UPDATE provider_services SET status = 'Active' WHERE request_id = ?`,
      [requestId],
    );

    res.json({
      success: true,
      message: "Service request approved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ رفض طلب خدمة
exports.rejectServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rejection_reason } = req.body;

    // 1. التحقق من وجود الطلب
    const [request] = await pool.query(
      `SELECT * FROM service_requests WHERE request_id = ? AND status = 'Pending'`,
      [requestId],
    );

    if (!request.length) {
      return res.status(404).json({
        success: false,
        message: "Service request not found or already processed",
      });
    }

    // 2. تحديث حالة الطلب
    await pool.query(
      `UPDATE service_requests 
       SET status = 'Rejected', rejection_reason = ? 
       WHERE request_id = ?`,
      [rejection_reason || null, requestId],
    );

    // 3. حذف provider_services المرتبطة
    await pool.query(
      `DELETE FROM provider_services WHERE request_id = ?`,
      [requestId],
    );

    res.json({
      success: true,
      message: "Service request rejected",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
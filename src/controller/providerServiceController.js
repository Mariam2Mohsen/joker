const pool = require("../config/db");

// جلب قائمة الخدمات التي يقدمها مقدم الخدمة
exports.getMyServices = async (req, res) => {
  try {
    const providerId = req.user.id;
    const [rows] = await pool.query(
      `SELECT ps.id, ps.service_id, s.name AS service_name, ps.description,
              ps.availability, ps.status,
              psp.pricing_type, psp.price
       FROM provider_services ps
       JOIN services s ON ps.service_id = s.service_id
       LEFT JOIN provider_service_prices psp ON ps.id = psp.provider_service_id
       WHERE ps.provider_id = ? AND ps.status = 'Active'
       ORDER BY ps.id DESC`,
      [providerId],
    );
    
    // تجميع الأسعار لكل خدمة
    const servicesMap = new Map();
    rows.forEach((row) => {
      if (!servicesMap.has(row.id)) {
        servicesMap.set(row.id, {
          id: row.id,
          service_id: row.service_id,
          service_name: row.service_name,
          description: row.description,
          availability: row.availability,
          status: row.status,
          prices: [],
        });
      }
      if (row.pricing_type && row.price) {
        servicesMap.get(row.id).prices.push({
          type: row.pricing_type,
          price: row.price,
        });
      }
    });
    
    const services = Array.from(servicesMap.values());
    res.json({ success: true, data: services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// جلب طلبات الخدمات المعلقة (Pending Service Requests)
// الخدمات التي تم إضافتها ولكن لم يتم تفعيلها بعد
exports.getPendingServices = async (req, res) => {
  try {
    const providerId = req.user.id;
    const [rows] = await pool.query(
      `SELECT ps.id, ps.service_id, s.name AS service_name, ps.description,
              ps.availability, ps.status,
              psp.pricing_type, psp.price,
              cat.name AS category_name, sub.name AS sub_category_name
       FROM provider_services ps
       JOIN services s ON ps.service_id = s.service_id
       JOIN categories cat ON s.category_id = cat.category_id
       JOIN sub_categories sub ON s.sub_category_id = sub.sub_category_id
       LEFT JOIN provider_service_prices psp ON ps.id = psp.provider_service_id
       WHERE ps.provider_id = ? AND ps.status = 'Inactive'
       ORDER BY ps.id DESC`,
      [providerId],
    );
    
    // تجميع الأسعار لكل خدمة
    const servicesMap = new Map();
    rows.forEach((row) => {
      if (!servicesMap.has(row.id)) {
        servicesMap.set(row.id, {
          id: row.id,
          service_id: row.service_id,
          service_name: row.service_name,
          category_name: row.category_name,
          sub_category_name: row.sub_category_name,
          description: row.description,
          availability: row.availability,
          status: row.status,
          prices: [],
        });
      }
      if (row.pricing_type && row.price) {
        servicesMap.get(row.id).prices.push({
          type: row.pricing_type,
          price: row.price,
        });
      }
    });
    
    const services = Array.from(servicesMap.values());
    res.json({ success: true, data: services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// إضافة خدمة جديدة (إنشاء طلب pending في service_requests)
exports.addService = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { service_id, prices, description, availability } = req.body;

    if (!service_id || !prices || !prices.length) {
      return res.status(400).json({
        success: false,
        message: "Service ID and at least one price type required",
      });
    }

    // 1. التحقق من وجود الخدمة في جدول services
    const [serviceCheck] = await pool.query(
      `SELECT s.service_id, s.name, s.category_id, s.sub_category_id
       FROM services s 
       WHERE s.service_id = ? AND s.status = 'Active'`,
      [service_id],
    );
    
    if (!serviceCheck.length) {
      return res.status(400).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    const service = serviceCheck[0];

    // 2. التحقق من max price لكل نوع سعر
    for (let p of prices) {
      const [pricing] = await pool.query(
        `SELECT max_price FROM service_pricing_types
         WHERE service_id = ? AND pricing_type = ? AND enabled = 1`,
        [service_id, p.type],
      );

      if (pricing.length && parseFloat(p.price) > parseFloat(pricing[0].max_price)) {
        return res.status(400).json({
          success: false,
          message: `Price for ${p.type} cannot exceed max price of ${pricing[0].max_price}`,
        });
      }
    }

    // 3. ✅ إضافة طلب في service_requests
    const [requestResult] = await pool.query(
      `INSERT INTO service_requests 
       (provider_id, service_name, category_id, sub_category_id, status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [
        providerId,
        service.name,
        service.category_id,
        service.sub_category_id,
      ],
    );

    const requestId = requestResult.insertId;

    // 4. تخزين تفاصيل الخدمة مؤقتاً (يمكن تخزينها في جدول مؤقت أو كـ JSON)
    // للتبسيط، سنخزن الأسعار والوصف في جدول منفصل أو كـ JSON
    // هنا سنقوم بتخزينها في provider_services بحالة 'pending'
    
    let availabilityJson = null;
    if (availability) {
      try {
        availabilityJson = JSON.stringify(availability);
      } catch (e) {
        availabilityJson = availability;
      }
    }

    const [psResult] = await pool.query(
      `INSERT INTO provider_services
       (provider_id, service_id, description, availability, status, request_id)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [
        providerId,
        service_id,
        description || null,
        availabilityJson,
        requestId,
      ],
    );

    const providerServiceId = psResult.insertId;

    // إدراج الأسعار لكل نوع
    for (let p of prices) {
      await pool.query(
        `INSERT INTO provider_service_prices
         (provider_service_id, pricing_type, price)
         VALUES (?, ?, ?)`,
        [providerServiceId, p.type, p.price],
      );
    }

    res.status(201).json({
      success: true,
      message: "Service request submitted successfully and pending admin approval",
      requestId: requestId,
      serviceId: providerServiceId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// موافقة Admin على الخدمة (API منفصل لـ Admin)
exports.approveService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    // تحديث حالة الخدمة إلى Active
    const [result] = await pool.query(
      `UPDATE provider_services SET status = 'Active' WHERE id = ?`,
      [serviceId],
    );
    
    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    
    res.json({
      success: true,
      message: "Service approved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// رفض الخدمة (حذفها)
exports.rejectService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    // حذف الأسعار أولاً
    await pool.query(
      `DELETE FROM provider_service_prices WHERE provider_service_id = ?`,
      [serviceId],
    );
    
    // حذف الخدمة
    const [result] = await pool.query(
      `DELETE FROM provider_services WHERE id = ?`,
      [serviceId],
    );
    
    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    
    res.json({
      success: true,
      message: "Service rejected and deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// تعديل خدمة
exports.updateService = async (req, res) => {
  try {
    const providerId = req.user.id;
    const serviceId = req.params.id;
    const { prices, description, availability } = req.body;

    // التحقق من ملكية الخدمة وحالتها الحالية
    const [existing] = await pool.query(
      `SELECT ps.id, ps.service_id, ps.status, s.name AS service_name,
              s.category_id, s.sub_category_id
       FROM provider_services ps
       JOIN services s ON ps.service_id = s.service_id
       WHERE ps.id = ? AND ps.provider_id = ?`,
      [serviceId, providerId],
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // التحقق من وجود حجوزات نشطة قبل التعديل
    const [activeBookings] = await pool.query(
      `SELECT booking_id FROM bookings
       WHERE provider_service_id = ? AND status IN ('pending', 'accepted', 'in_progress')`,
      [serviceId],
    );
    
    if (activeBookings.length) {
      return res.status(400).json({
        success: false,
        message: "Cannot update service with active bookings",
      });
    }

    // التحقق من max price إذا تم تعديل الأسعار
    if (prices && prices.length) {
      for (let p of prices) {
        const [pricing] = await pool.query(
          `SELECT max_price FROM service_pricing_types
           WHERE service_id = ? AND pricing_type = ? AND enabled = 1`,
          [existing[0].service_id, p.type],
        );

        if (pricing.length && parseFloat(p.price) > parseFloat(pricing[0].max_price)) {
          return res.status(400).json({
            success: false,
            message: `Price for ${p.type} cannot exceed max price of ${pricing[0].max_price}`,
          });
        }
      }
    }

    // تحديث بيانات الخدمة
    const updates = [];
    const values = [];

    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    
    if (availability !== undefined) {
      let availabilityJson = availability;
      if (typeof availability === 'object') {
        availabilityJson = JSON.stringify(availability);
      }
      updates.push("availability = ?");
      values.push(availabilityJson);
    }

    if (updates.length) {
      values.push(serviceId);
      await pool.query(
        `UPDATE provider_services SET ${updates.join(", ")} WHERE id = ?`,
        values,
      );
    }

    // تحديث الأسعار إذا كانت موجودة
    if (prices && prices.length) {
      // حذف الأسعار القديمة
      await pool.query(
        `DELETE FROM provider_service_prices WHERE provider_service_id = ?`,
        [serviceId],
      );

      // إضافة الأسعار الجديدة
      for (let p of prices) {
        await pool.query(
          `INSERT INTO provider_service_prices
           (provider_service_id, pricing_type, price)
           VALUES (?, ?, ?)`,
          [serviceId, p.type, p.price],
        );
      }
    }

    res.json({
      success: true,
      message: "Service updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// تفعيل/تعطيل الخدمة
exports.toggleServiceStatus = async (req, res) => {
  try {
    const providerId = req.user.id;
    const serviceId = req.params.id;
    const { active } = req.body;

    const [service] = await pool.query(
      `SELECT id, status FROM provider_services
       WHERE id = ? AND provider_id = ? AND status = 'Active'`,
      [serviceId, providerId],
    );
    
    if (!service.length && active) {
      return res.status(404).json({ 
        success: false, 
        message: "Service not found or not active" 
      });
    }

    const newStatus = active ? "Active" : "Inactive";
    await pool.query(`UPDATE provider_services SET status = ? WHERE id = ?`, [
      newStatus,
      serviceId,
    ]);
    
    res.json({ 
      success: true, 
      message: `Service ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// حذف الخدمة (إذا لم توجد حجوزات نشطة)
exports.deleteService = async (req, res) => {
  try {
    const providerId = req.user.id;
    const serviceId = req.params.id;

    // التحقق من وجود حجوزات نشطة
    const [bookings] = await pool.query(
      `SELECT booking_id FROM bookings
       WHERE provider_service_id = ? AND status IN ('pending', 'accepted', 'in_progress')`,
      [serviceId],
    );
    
    if (bookings.length) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete service with active bookings",
      });
    }

    // حذف الأسعار أولاً
    await pool.query(
      `DELETE FROM provider_service_prices WHERE provider_service_id = ?`,
      [serviceId],
    );
    
    // حذف الخدمة
    const [result] = await pool.query(
      `DELETE FROM provider_services WHERE id = ? AND provider_id = ?`,
      [serviceId, providerId],
    );
    
    if (!result.affectedRows) {
      return res.status(404).json({ 
        success: false, 
        message: "Service not found" 
      });
    }
    
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
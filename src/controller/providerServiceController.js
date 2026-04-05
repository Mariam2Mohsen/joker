  // backend/src/controller/providerServiceController.js

  const pool = require("../config/db");

  // ==============================================
  // ✅ 1. MY SERVICES - الخدمات المعتمدة والنشطة
  // ==============================================
  exports.getMyServices = async (req, res) => {
    try {
      const providerId = req.user.id;

      const [rows] = await pool.query(
        `SELECT 
            ps.id, 
            ps.service_id, 
            ps.description, 
            ps.availability,
            ps.status, 
            ps.approval_status,
            ps.approved_at,
            ps.service_image,
            s.name AS service_name,
            s.category_id,
            s.sub_category_id,
            s.rate AS service_rating,
            cat.name AS category_name,
            sub.name AS sub_category_name,
            psp.pricing_type,
            psp.price
          FROM provider_services ps
          INNER JOIN services s ON ps.service_id = s.service_id
          LEFT JOIN categories cat ON s.category_id = cat.category_id
          LEFT JOIN sub_categories sub ON s.sub_category_id = sub.sub_category_id
          LEFT JOIN provider_service_prices psp ON ps.id = psp.provider_service_id
          WHERE ps.provider_id = ? 
            AND ps.approval_status = 'Approved'
          ORDER BY ps.id DESC`,
        [providerId],
      );

      // تجميع الأسعار لكل خدمة
      const servicesMap = new Map();

      rows.forEach((row) => {
        if (!servicesMap.has(row.id)) {
          // ✅ معالجة availability بشكل آمن
          let availabilityData = null;
          if (row.availability) {
            try {
              // لو كان string، نحاول parse
              if (typeof row.availability === "string") {
                availabilityData = JSON.parse(row.availability);
              } else {
                // لو كان object بالفعل
                availabilityData = row.availability;
              }
            } catch (e) {
              console.error(
                `Error parsing availability for service ${row.id}:`,
                e,
              );
              availabilityData = null;
            }
          }

          servicesMap.set(row.id, {
            id: row.id,
            service_id: row.service_id,
            service_name: row.service_name,
            category_id: row.category_id,
            category_name: row.category_name,
            sub_category_id: row.sub_category_id,
            sub_category_name: row.sub_category_name,
            description: row.description,
            availability: availabilityData,
            status: row.status,
            approval_status: row.approval_status,
            approved_at: row.approved_at,
            service_image: row.service_image,
            service_rating: row.service_rating,
            prices: [],
          });
        }

        if (row.pricing_type && row.price !== null) {
          servicesMap.get(row.id).prices.push({
            type: row.pricing_type,
            price: parseFloat(row.price),
          });
        }
      });

      const services = Array.from(servicesMap.values());

      // جلب الصور الإضافية لكل خدمة
      for (let service of services) {
        const [images] = await pool.query(
          `SELECT id, image_url, is_primary 
            FROM provider_service_images 
            WHERE provider_service_id = ?`,
          [service.id],
        );
        service.gallery = images;
      }

      res.json({
        success: true,
        data: services,
        count: services.length,
      });
    } catch (err) {
      console.error("getMyServices error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 2. SERVICE REQUESTS - الطلبات المنتظرة/المرفوضة
  // ==============================================
  exports.getServiceRequests = async (req, res) => {
    try {
      const providerId = req.user.id;
      const { status } = req.query;

      let sql = `
          SELECT 
            sr.request_id as id,
            sr.provider_id,
            sr.service_name,
            sr.category_id,
            sr.sub_category_id,
            sr.status,
            sr.created_at as submitted_on,
            sr.rejection_reason,
            sr.updated_at,
            cat.name AS category_name,
            sub.name AS sub_category_name,
            ps.id as provider_service_id,
            ps.approval_status as provider_service_status,
            ps.description,
            ps.availability,
            psp.pricing_type,
            psp.price
          FROM service_requests sr
          LEFT JOIN categories cat ON sr.category_id = cat.category_id
          LEFT JOIN sub_categories sub ON sr.sub_category_id = sub.sub_category_id
          LEFT JOIN provider_services ps ON sr.request_id = ps.request_id AND ps.provider_id = ?
          LEFT JOIN provider_service_prices psp ON ps.id = psp.provider_service_id
          WHERE sr.provider_id = ?
        `;

      let params = [providerId, providerId];

      if (status === "pending") {
        sql += " AND sr.status = 'Pending'";
      } else if (status === "rejected") {
        sql += " AND sr.status = 'Rejected'";
      } else if (status === "approved") {
        sql += " AND sr.status = 'Approved'";
      } else if (status === "all") {
        // No status filter
      } else {
        sql += " AND sr.status IN ('Pending', 'Rejected')";
      }

      sql += " ORDER BY sr.request_id DESC";

      const [rows] = await pool.query(sql, params);
      const requestsMap = new Map();

      rows.forEach((row) => {
        if (!requestsMap.has(row.id)) {
          let availabilityData = null;
          if (row.availability) {
            try {
              if (typeof row.availability === "string") {
                availabilityData = JSON.parse(row.availability);
              } else {
                availabilityData = row.availability;
              }
            } catch (e) {
              console.error(`Error parsing availability for request ${row.id}:`, e);
            }
          }

          requestsMap.set(row.id, {
            id: row.id,
            service_name: row.service_name,
            category_id: row.category_id,
            category_name: row.category_name || `Category ID: ${row.category_id}`,
            sub_category_id: row.sub_category_id,
            sub_category_name: row.sub_category_name || `Sub Category ID: ${row.sub_category_id}`,
            status: row.status,
            rejection_reason: row.rejection_reason,
            submitted_on: row.submitted_on,
            updated_at: row.updated_at,
            provider_service_id: row.provider_service_id,
            provider_service_status: row.provider_service_status,
            description: row.description,
            availability: availabilityData,
            pricing_type: row.pricing_type,
            price: row.price ? parseFloat(row.price) : null,
          });
        }
      });

      const formattedRequests = Array.from(requestsMap.values());

      res.json({
        success: true,
        data: formattedRequests,
        count: formattedRequests.length,
      });
    } catch (err) {
      console.error("getServiceRequests error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 3. ADD SERVICE REQUEST - إضافة طلب خدمة جديد
  // ==============================================
  exports.addServiceRequest = async (req, res) => {
    try {
      const providerId = req.user.id;
      const {
        service_name,
        category_id,
        sub_category_id,
        pricing_type,
        price,
        description,
        availability,
        images,
      } = req.body;

      // 1. التحقق من الحقول المطلوبة
      if (!service_name || !category_id || !sub_category_id) {
        return res.status(400).json({
          success: false,
          message: "Service name, category, and sub-category are required",
        });
      }

      // 2. التحقق من وجود التصنيف
      const [categoryCheck] = await pool.query(
        `SELECT category_id FROM categories 
          WHERE category_id = ? AND status = 'Active'`,
        [category_id],
      );

      if (!categoryCheck.length) {
        return res.status(400).json({
          success: false,
          message: "Category not found or inactive",
        });
      }

      // 3. التحقق من وجود التصنيف الفرعي
      const [subCategoryCheck] = await pool.query(
        `SELECT sub_category_id FROM sub_categories 
          WHERE sub_category_id = ? AND status = 'Active'`,
        [sub_category_id],
      );

      if (!subCategoryCheck.length) {
        return res.status(400).json({
          success: false,
          message: "Sub-category not found or inactive",
        });
      }

      // 4. التحقق من max_price إذا تم إرسال سعر
      if (price && pricing_type) {
        const [maxPriceCheck] = await pool.query(
          `SELECT stp.max_price, s.name, s.service_id
            FROM service_pricing_types stp
            JOIN services s ON stp.service_id = s.service_id
            WHERE s.name = ? AND s.category_id = ? AND s.sub_category_id = ?
            AND stp.pricing_type = ? AND stp.enabled = 1`,
          [service_name, category_id, sub_category_id, pricing_type],
        );

        if (maxPriceCheck.length) {
          const maxPrice = parseFloat(maxPriceCheck[0].max_price);
          const providerPrice = parseFloat(price);

          if (providerPrice > maxPrice) {
            return res.status(400).json({
              success: false,
              message: `Price (${providerPrice}) cannot exceed max price (${maxPrice}) for ${pricing_type} pricing`,
            });
          }
        }
      }

      // 5. إضافة طلب الخدمة
      const [result] = await pool.query(
        `INSERT INTO service_requests 
          (provider_id, service_name, category_id, sub_category_id, status, created_at)
          VALUES (?, ?, ?, ?, 'Pending', NOW())`,
        [providerId, service_name, category_id, sub_category_id],
      );

      const requestId = result.insertId;

      // ✅ تحويل availability إلى JSON string إذا كان object
      let availabilityJson = null;
      if (availability) {
        availabilityJson =
          typeof availability === "object"
            ? JSON.stringify(availability)
            : availability;
      }

      // 6. إنشاء سجل في provider_services مع approval_status = 'Pending'
    // جلب service_id من جدول services
  const [serviceRows] = await pool.query(
    `SELECT service_id FROM services 
    WHERE name = ? AND category_id = ? AND sub_category_id = ?`,
    [service_name, category_id, sub_category_id]
  );

  if (!serviceRows.length) {
    return res.status(400).json({
      success: false,
      message: "Service not found"
    });
  }

  const serviceId = serviceRows[0].service_id;

  // بعدين تدخل provider_services
  const [psResult] = await pool.query(
    `INSERT INTO provider_services 
    (provider_id, service_id, status, approval_status, description, availability, request_id)
    VALUES (?, ?, 'Pending', 'Pending', ?, ?, ?)`,
    [providerId, serviceId, description || null, availabilityJson, requestId]
  );

      const providerServiceId = psResult.insertId;

      // 7. إضافة السعر إذا وجد
      if (pricing_type && price) {
        await pool.query(
          `INSERT INTO provider_service_prices 
            (provider_service_id, pricing_type, price)
            VALUES (?, ?, ?)`,
          [providerServiceId, pricing_type, price],
        );
      }

      // 8. إضافة الصور إذا وجدت
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          await pool.query(
            `INSERT INTO provider_service_images 
              (provider_service_id, image_url, is_primary)
              VALUES (?, ?, ?)`,
            [providerServiceId, images[i], i === 0 ? 1 : 0],
          );
        }
      }

      res.status(201).json({
        success: true,
        message: "Service request submitted successfully, pending admin approval",
        data: {
          request_id: requestId,
          provider_service_id: providerServiceId,
        },
      });
    } catch (err) {
      console.error("addServiceRequest error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 4. GET SINGLE SERVICE REQUEST
  // ==============================================
  exports.getServiceRequestById = async (req, res) => {
    try {
      const providerId = req.user.id;
      const { requestId } = req.params;

      const [rows] = await pool.query(
        `SELECT 
            sr.request_id as id,
            sr.provider_id,
            sr.service_name,
            sr.category_id,
            sr.sub_category_id,
            sr.status,
            sr.created_at as submitted_on,
            sr.rejection_reason,
            sr.updated_at,
            cat.name AS category_name,
            sub.name AS sub_category_name,
            ps.id as provider_service_id,
            ps.description,
            ps.availability,
            psp.pricing_type,
            psp.price
          FROM service_requests sr
          LEFT JOIN categories cat ON sr.category_id = cat.category_id
          LEFT JOIN sub_categories sub ON sr.sub_category_id = sub.sub_category_id
          LEFT JOIN provider_services ps ON sr.request_id = ps.request_id AND ps.provider_id = ?
          LEFT JOIN provider_service_prices psp ON ps.id = psp.provider_service_id
          WHERE sr.request_id = ? AND sr.provider_id = ?`,
        [providerId, requestId, providerId],
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Service request not found",
        });
      }

      const request = rows[0];

      // ✅ معالجة availability بشكل آمن
      if (request.availability) {
        try {
          if (typeof request.availability === "string") {
            request.availability = JSON.parse(request.availability);
          }
        } catch (e) {
          console.error(
            `Error parsing availability for request ${requestId}:`,
            e,
          );
          request.availability = null;
        }
      }

      // جلب الصور
      if (request.provider_service_id) {
        const [images] = await pool.query(
          `SELECT id, image_url, is_primary 
            FROM provider_service_images 
            WHERE provider_service_id = ?`,
          [request.provider_service_id],
        );
        request.images = images;
      }

      res.json({ success: true, data: request });
    } catch (err) {
      console.error("getServiceRequestById error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 5. DELETE SERVICE REQUEST
  // ==============================================
  exports.deleteServiceRequest = async (req, res) => {
    try {
      const providerId = req.user.id;
      const { requestId } = req.params;

      // حذف provider_services المرتبط أولاً
      await pool.query(
        `DELETE FROM provider_services 
          WHERE request_id = ? AND provider_id = ? AND approval_status IN ('Pending', 'Rejected')`,
        [requestId, providerId],
      );

      // حذف service_request
      const [result] = await pool.query(
        `DELETE FROM service_requests 
          WHERE request_id = ? AND provider_id = ? AND status IN ('Pending', 'Rejected')`,
        [requestId, providerId],
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Service request not found or cannot be deleted",
        });
      }

      res.json({
        success: true,
        message: "Service request deleted successfully",
      });
    } catch (err) {
      console.error("deleteServiceRequest error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 6. RESUBMIT REJECTED SERVICE REQUEST
  // ==============================================
  exports.resubmitServiceRequest = async (req, res) => {
    try {
      const providerId = req.user.id;
      const { id } = req.params;
      const {
        service_name,
        category_id,
        sub_category_id,
        pricing_type,
        price,
        description,
        availability,
      } = req.body;

      // التحقق من وجود الطلب المرفوض
      const [request] = await pool.query(
        `SELECT request_id FROM service_requests 
          WHERE request_id = ? AND provider_id = ? AND status = 'Rejected'`,
        [id, providerId],
      );

      if (!request.length) {
        return res.status(404).json({
          success: false,
          message: "No rejected service request found",
        });
      }

      // تحديث service_requests
      const updates = [];
      const values = [];

      if (service_name) {
        updates.push("service_name = ?");
        values.push(service_name);
      }
      if (category_id) {
        updates.push("category_id = ?");
        values.push(category_id);
      }
      if (sub_category_id !== undefined) {
        updates.push("sub_category_id = ?");
        values.push(sub_category_id || null);
      }

      updates.push("status = 'Pending'");
      updates.push("rejection_reason = NULL");
      updates.push("updated_at = NOW()");
      values.push(id);

      await pool.query(
        `UPDATE service_requests SET ${updates.join(", ")} WHERE request_id = ?`,
        values,
      );

      // تحديث provider_services المرتبط
      const [ps] = await pool.query(
        `SELECT id FROM provider_services 
          WHERE request_id = ? AND provider_id = ?`,
        [id, providerId],
      );

      if (ps.length) {
        // ✅ تحويل availability إلى JSON string إذا كان object
        let availabilityJson = null;
        if (availability) {
          availabilityJson =
            typeof availability === "object"
              ? JSON.stringify(availability)
              : availability;
        }

        await pool.query(
          `UPDATE provider_services 
            SET approval_status = 'Pending', 
                status = 'Pending',
                rejection_reason = NULL,
                description = COALESCE(?, description),
                availability = COALESCE(?, availability),
                updated_at = NOW()
            WHERE id = ?`,
          [description || null, availabilityJson, ps[0].id],
        );

        // تحديث السعر
        if (pricing_type && price) {
          await pool.query(
            `UPDATE provider_service_prices 
              SET pricing_type = ?, price = ?
              WHERE provider_service_id = ?`,
            [pricing_type, price, ps[0].id],
          );
        }
      }

      res.json({
        success: true,
        message:
          "Service request resubmitted successfully, pending admin approval",
      });
    } catch (err) {
      console.error("resubmitServiceRequest error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 7. TOGGLE SERVICE STATUS (تفعيل/تعطيل خدمة معتمدة)
  // ==============================================
  exports.toggleServiceStatus = async (req, res) => {
    try {
      const providerId = req.user.id;
      const serviceId = req.params.id;
      const { active } = req.body;

      const newStatus = active ? "Active" : "Inactive";

      const [result] = await pool.query(
        `UPDATE provider_services 
          SET status = ?, updated_at = NOW()
          WHERE id = ? 
            AND provider_id = ? 
            AND approval_status = 'Approved'`,
        [newStatus, serviceId, providerId],
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Service not found or not approved",
        });
      }

      res.json({
        success: true,
        message: `Service ${newStatus === "Active" ? "activated" : "deactivated"} successfully`,
        data: { id: serviceId, status: newStatus },
      });
    } catch (err) {
      console.error("toggleServiceStatus error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 8. UPDATE APPROVED SERVICE
  // ==============================================
  exports.updateService = async (req, res) => {
    try {
      const providerId = req.user.id;
      const serviceId = req.params.id;
      const { description, availability } = req.body;

      const [existing] = await pool.query(
        `SELECT id FROM provider_services 
          WHERE id = ? AND provider_id = ? AND approval_status = 'Approved'`,
        [serviceId, providerId],
      );

      if (!existing.length) {
        return res.status(404).json({
          success: false,
          message: "Service not found or not approved",
        });
      }

      const updates = [];
      const values = [];

      if (description !== undefined) {
        updates.push("description = ?");
        values.push(description);
      }

      if (availability !== undefined) {
        const availabilityJson =
          typeof availability === "object"
            ? JSON.stringify(availability)
            : availability;
        updates.push("availability = ?");
        values.push(availabilityJson);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No data to update",
        });
      }

      updates.push("updated_at = NOW()");
      values.push(serviceId);

      await pool.query(
        `UPDATE provider_services SET ${updates.join(", ")} WHERE id = ?`,
        values,
      );

      res.json({
        success: true,
        message: "Service updated successfully",
      });
    } catch (err) {
      console.error("updateService error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 9. DELETE SERVICE (فقط إذا مفيش حجوزات نشطة)
  // ==============================================
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
          message:
            "Cannot delete service with active bookings. You can deactivate it instead.",
        });
      }

      const [result] = await pool.query(
        `DELETE FROM provider_services 
          WHERE id = ? AND provider_id = ?`,
        [serviceId, providerId],
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.json({
        success: true,
        message: "Service deleted successfully",
      });
    } catch (err) {
      console.error("deleteService error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ==============================================
  // ✅ 10. GET SERVICE IMAGES
  // ==============================================
  exports.getServiceImages = async (req, res) => {
    try {
      const { providerServiceId } = req.params;
      const providerId = req.user.id;

      // التحقق من ملكية الخدمة
      const [check] = await pool.query(
        `SELECT id FROM provider_services 
          WHERE id = ? AND provider_id = ?`,
        [providerServiceId, providerId],
      );

      if (!check.length) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view these images",
        });
      }

      const [images] = await pool.query(
        `SELECT id, image_url, is_primary 
          FROM provider_service_images
          WHERE provider_service_id = ?`,
        [providerServiceId],
      );

      res.json({
        success: true,
        data: images,
        primary: images.find((img) => img.is_primary === 1),
        gallery: images.filter((img) => img.is_primary === 0),
      });
    } catch (err) {
      console.error("getServiceImages error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  // ==============================================
  // ✅ 11. GET DASHBOARD STATS
  // ==============================================
  exports.getDashboardStats = async (req, res) => {
    try {
      const providerId = req.user.id;
  
      // 1. إجمالي الأرباح (من الحجوزات المكتملة)
      const [earningsRows] = await pool.query(
        "SELECT SUM(total_price) as totalEarnings FROM bookings WHERE provider_id = ? AND status = 'completed'",
        [providerId]
      );
  
      // 2. إجمالي الحجوزات
      const [bookingsRows] = await pool.query(
        "SELECT COUNT(*) as totalBookings FROM bookings WHERE provider_id = ?",
        [providerId]
      );
  
      // 3. متوسط التقييم
      const [ratingRows] = await pool.query(
        `SELECT AVG(rating) as avgRating FROM reviews 
         WHERE provider_service_id IN (SELECT id FROM provider_services WHERE provider_id = ?)`,
        [providerId]
      );
  
      // 4. عدد الخدمات النشطة
      const [activeServicesRows] = await pool.query(
        `SELECT COUNT(*) as activeServices FROM provider_services 
         WHERE provider_id = ? AND status = 'Active' AND approval_status = 'Approved'`,
        [providerId]
      );
  
      // 5. عدد طلبات الخدمات المعلقة
      const [pendingRequestsRows] = await pool.query(
        `SELECT COUNT(*) as pendingRequests FROM service_requests 
         WHERE provider_id = ? AND status = 'Pending'`,
        [providerId]
      );
  
      res.json({
        success: true,
        data: {
          totalEarnings: earningsRows[0].totalEarnings || 0,
          totalBookings: bookingsRows[0].totalBookings || 0,
          avgRating: parseFloat(ratingRows[0].avgRating || 0).toFixed(1),
          activeServices: activeServicesRows[0].activeServices || 0,
          pendingRequests: pendingRequestsRows[0].pendingRequests || 0
        }
      });
    } catch (err) {
      console.error("getDashboardStats error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

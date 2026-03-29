const pool = require("../config/db");

// جلب جميع الخدمات النشطة مع أنواع التسعير
exports.getActiveServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.service_id, s.name, s.category_id, s.sub_category_id,
              s.discount, s.commission_type, s.commission_value, s.status, s.rate,
              stp.pricing_type, stp.max_price, stp.enabled,
              c.name AS category_name, sc.name AS sub_category_name
       FROM services s
       LEFT JOIN service_pricing_types stp ON s.service_id = stp.service_id
       LEFT JOIN categories c ON s.category_id = c.category_id
       LEFT JOIN sub_categories sc ON s.sub_category_id = sc.sub_category_id
       WHERE s.status = 'Active'
       ORDER BY s.service_id DESC`
    );

    const servicesMap = new Map();
    rows.forEach(row => {
      if (!servicesMap.has(row.service_id)) {
        servicesMap.set(row.service_id, {
          service_id: row.service_id,
          name: row.name,
          category_id: row.category_id,
          category_name: row.category_name,
          sub_category_id: row.sub_category_id,
          sub_category_name: row.sub_category_name,
          discount: row.discount,
          commission_type: row.commission_type,
          commission_value: row.commission_value,
          status: row.status,
          rate: row.rate,
          pricing_types: []
        });
      }
      if (row.pricing_type && row.enabled) {
        servicesMap.get(row.service_id).pricing_types.push({
          type: row.pricing_type,
          max_price: row.max_price,
          enabled: row.enabled
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

// جلب تفاصيل خدمة معينة
exports.getServiceById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query(
      `SELECT s.service_id, s.name, s.category_id, s.sub_category_id,
              s.discount, s.commission_type, s.commission_value, s.status, s.rate,
              stp.pricing_type, stp.max_price, stp.enabled,
              c.name AS category_name, c.description AS category_description,
              sc.name AS sub_category_name, sc.description AS sub_category_description
       FROM services s
       LEFT JOIN service_pricing_types stp ON s.service_id = stp.service_id
       LEFT JOIN categories c ON s.category_id = c.category_id
       LEFT JOIN sub_categories sc ON s.sub_category_id = sc.sub_category_id
       WHERE s.service_id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const service = {
      service_id: rows[0].service_id,
      name: rows[0].name,
      category_id: rows[0].category_id,
      category_name: rows[0].category_name,
      category_description: rows[0].category_description,
      sub_category_id: rows[0].sub_category_id,
      sub_category_name: rows[0].sub_category_name,
      sub_category_description: rows[0].sub_category_description,
      discount: rows[0].discount,
      commission_type: rows[0].commission_type,
      commission_value: rows[0].commission_value,
      status: rows[0].status,
      rate: rows[0].rate,
      pricing_types: rows
        .filter(row => row.pricing_type && row.enabled)
        .map(row => ({ 
          type: row.pricing_type, 
          max_price: row.max_price, 
          enabled: row.enabled 
        }))
    };

    res.json({ success: true, data: service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
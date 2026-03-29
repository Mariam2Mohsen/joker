const db = require("../config/db");

// GET Sub-Categories (with filters)
exports.getSubCategories = async (req, res) => {
  try {
    const { category_id, status } = req.query;
    
    let query = `
      SELECT 
        sc.sub_category_id as id,
        sc.category_id,
        sc.name,
        sc.description,
        sc.status,
        sc.sort_order,
        c.name AS category_name,
        c.status AS category_status
      FROM sub_categories sc
      JOIN categories c ON c.category_id = sc.category_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (category_id) {
      query += ` AND sc.category_id = ?`;
      params.push(category_id);
    }
    
    if (status && ['active', 'inactive'].includes(status)) {
      query += ` AND sc.status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY sc.sort_order ASC, sc.sub_category_id DESC`;
    
    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//  Get Single Sub-Category
exports.getSubCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    
    const [rows] = await db.query(
      `SELECT 
        sc.sub_category_id as id,
        sc.category_id,
        sc.name,
        sc.description,
        sc.status,
        sc.sort_order,
        c.name AS category_name
       FROM sub_categories sc
       JOIN categories c ON c.category_id = sc.category_id
       WHERE sc.sub_category_id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found"
      });
    }

    return res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//  Create Sub-Category
exports.createSubCategory = async (req, res) => {
  try {
    const { category_id, name, description, status, sort_order } = req.body;

    if (!category_id || !name) {
      return res.status(400).json({
        success: false,
        message: "category_id and name are required"
      });
    }

    // Check if category exists and is active
    const [cat] = await db.query(
      "SELECT category_id, status FROM categories WHERE category_id = ?",
      [category_id]
    );

    if (!cat.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // SRS: Only active categories can have sub-categories
    if (cat[0].status !== 'active') {
      return res.status(400).json({
        success: false,
        message: "Cannot add sub-category to inactive category"
      });
    }

    // Check if sub-category already exists in this category
    const [exist] = await db.query(
      `SELECT sub_category_id FROM sub_categories
       WHERE name = ? AND category_id = ?`,
      [name, category_id]
    );

    if (exist.length) {
      return res.status(409).json({
        success: false,
        message: "Sub-category with this name already exists in this category"
      });
    }

    // Insert new sub-category
    const [result] = await db.query(
      `INSERT INTO sub_categories (category_id, name, description, status, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        description || null,
        status || 'active',
        sort_order || 0
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Sub-category created successfully",
      id: result.insertId
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//  Update Sub-Category
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, description, status, sort_order } = req.body;
    const id = req.params.id;

    // Check if sub-category exists
    const [sub] = await db.query(
      "SELECT * FROM sub_categories WHERE sub_category_id = ?",
      [id]
    );

    if (!sub.length) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found"
      });
    }

    // Check for duplicate name (excluding current)
    if (name && name !== sub[0].name) {
      const [exist] = await db.query(
        `SELECT sub_category_id FROM sub_categories
         WHERE name = ? AND category_id = ? AND sub_category_id != ?`,
        [name, sub[0].category_id, id]
      );

      if (exist.length) {
        return res.status(409).json({
          success: false,
          message: "Sub-category name already exists in this category"
        });
      }
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (status !== undefined && ['active', 'inactive'].includes(status)) {
      updates.push("status = ?");
      values.push(status);
    }
    if (sort_order !== undefined) {
      updates.push("sort_order = ?");
      values.push(sort_order);
    }

    if (!updates.length) {
      return res.status(400).json({
        success: false,
        message: "No data to update"
      });
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await db.query(
      `UPDATE sub_categories SET ${updates.join(", ")} WHERE sub_category_id = ?`,
      values
    );

    return res.json({
      success: true,
      message: "Sub-category updated successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//  Delete Sub-Category 
exports.deleteSubCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if sub-category exists
    const [sub] = await db.query(
      "SELECT sub_category_id FROM sub_categories WHERE sub_category_id = ?",
      [id]
    );

    if (!sub.length) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found"
      });
    }

    //  SRS: Sub-category cannot be deleted if it has services
    const [services] = await db.query(
      "SELECT service_id FROM services WHERE sub_category_id = ?",
      [id]
    );

    if (services.length) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete sub-category: it has services. Please delete or reassign all services first."
      });
    }

    // Soft delete (update deleted_at) OR hard delete
    // Using soft delete as per schema (deleted_at exists)
    await db.query(
      "UPDATE sub_categories SET deleted_at = NOW() WHERE sub_category_id = ?",
      [id]
    );

    return res.json({
      success: true,
      message: "Sub-category deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//  Change Sub-Category Status (Activate/Deactivate)
exports.changeSubCategoryStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // 'active' or 'inactive'

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'inactive'"
      });
    }

    const [result] = await db.query(
      "UPDATE sub_categories SET status = ?, updated_at = NOW() WHERE sub_category_id = ?",
      [status, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found"
      });
    }

    return res.json({
      success: true,
      message: `Sub-category ${status === 'active' ? 'activated' : 'deactivated'} successfully`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
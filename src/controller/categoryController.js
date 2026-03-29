const db = require("../config/db");

//  GET Categories (with status filter)
exports.getCategories = async (req, res) => {
  try {
    const { status } = req.query;
    
    if (req.params.id) {
      const [rows] = await db.query(
        `SELECT category_id, name, color, description, image, status, sort_order, rate
         FROM categories 
         WHERE category_id = ? AND deleted_at IS NULL`,
        [req.params.id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }

      return res.json({
        success: true,
        data: rows[0]
      });
    }

    let query = `SELECT category_id, name, color, description, image, status, sort_order, rate
                 FROM categories WHERE deleted_at IS NULL`;
    const params = [];
    
    if (status && ['active', 'inactive'].includes(status)) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY sort_order ASC, category_id DESC`;

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

// Create Category (مع حساب category_id يدوياً)
exports.createCategory = async (req, res) => {
  try {
    const { name, color, description, status, sort_order } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name required"
      });
    }

    // Check if category already exists (including soft deleted)
    const [exist] = await db.query(
      "SELECT category_id FROM categories WHERE name = ?",
      [name]
    );

    if (exist.length) {
      return res.status(409).json({
        success: false,
        message: "Category name already used"
      });
    }

    //  Get the next available category_id
    const [maxId] = await db.query(
      "SELECT MAX(category_id) as max_id FROM categories"
    );
    const nextId = (maxId[0].max_id || 0) + 1;

    // Set default values
    let finalStatus = status;
    if (!finalStatus || (finalStatus !== 'active' && finalStatus !== 'inactive')) {
      finalStatus = 'active';
    }

    // Insert new category with manual ID
    const [result] = await db.query(
      `INSERT INTO categories (category_id, name, color, description, image, status, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        nextId,
        name,
        color || null,
        description || null,
        image,
        finalStatus,
        sort_order || 0
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      id: nextId
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//  Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { name, color, description, status, sort_order } = req.body;
    const id = req.params.id;

    // Check if category exists and not deleted
    const [category] = await db.query(
      "SELECT * FROM categories WHERE category_id = ? AND deleted_at IS NULL",
      [id]
    );

    if (!category.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    let image = category[0].image;
    if (req.file) {
      image = req.file.filename;
    }

    // Check for duplicate name (excluding current category)
    if (name && name !== category[0].name) {
      const [exist] = await db.query(
        "SELECT category_id FROM categories WHERE name = ? AND category_id != ? AND deleted_at IS NULL",
        [name, id]
      );

      if (exist.length) {
        return res.status(409).json({
          success: false,
          message: "Category name already exists"
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
    if (color !== undefined) {
      updates.push("color = ?");
      values.push(color);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (image !== undefined) {
      updates.push("image = ?");
      values.push(image);
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
      `UPDATE categories SET ${updates.join(", ")} WHERE category_id = ?`,
      values
    );

    return res.json({
      success: true,
      message: "Category updated successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ Delete Category (Soft Delete - using deleted_at)
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if category exists and not deleted
    const [category] = await db.query(
      "SELECT category_id FROM categories WHERE category_id = ? AND deleted_at IS NULL",
      [id]
    );

    if (!category.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // ✅ SRS: Category cannot be deleted if it has sub-categories
    const [subs] = await db.query(
      "SELECT sub_category_id FROM sub_categories WHERE category_id = ? AND deleted_at IS NULL",
      [id]
    );

    if (subs.length) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category: it has sub-categories. Please delete or reassign all sub-categories first."
      });
    }

    // ✅ Soft delete (set deleted_at)
    await db.query(
      "UPDATE categories SET deleted_at = NOW() WHERE category_id = ?",
      [id]
    );

    return res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ Change Category Status (Activate/Deactivate)
exports.changeCategoryStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'inactive'"
      });
    }

    // Check if category exists and not deleted
    const [category] = await db.query(
      "SELECT category_id FROM categories WHERE category_id = ? AND deleted_at IS NULL",
      [id]
    );

    if (!category.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const [result] = await db.query(
      "UPDATE categories SET status = ?, updated_at = NOW() WHERE category_id = ?",
      [status, id]
    );

    return res.json({
      success: true,
      message: `Category ${status === 'active' ? 'activated' : 'deactivated'} successfully`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
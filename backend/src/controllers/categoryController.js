const pool = require('../utils/db');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a new category (admin only)
const addCategory = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin only.' });
  }
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  try {
    await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Category added.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Category already exists.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllCategories, addCategory }; 
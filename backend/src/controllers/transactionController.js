const pool = require('../utils/db');

// Get all transactions for the logged-in user
const getAllTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT t.*, c.name as category FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? ORDER BY t.date DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single transaction by ID (must belong to user)
const getTransactionById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT t.*, c.name as category FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.id = ? AND t.user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Transaction not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new transaction (admin/user only)
const createTransaction = async (req, res) => {
  if (!['admin', 'user'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient privileges.' });
  }
  const { category_id, type, amount, description, date } = req.body;
  if (!category_id || !type || !amount || !date) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type.' });
  }
  try {
    await pool.query(
      'INSERT INTO transactions (user_id, category_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, category_id, type, amount, description || '', date]
    );
    res.status(201).json({ message: 'Transaction created.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a transaction (admin/user only, must own)
const updateTransaction = async (req, res) => {
  if (!['admin', 'user'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient privileges.' });
  }
  const { category_id, type, amount, description, date } = req.body;
  try {
    // Check ownership
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Transaction not found.' });
    await pool.query(
      'UPDATE transactions SET category_id=?, type=?, amount=?, description=?, date=? WHERE id=?',
      [category_id || rows[0].category_id, type || rows[0].type, amount || rows[0].amount, description || rows[0].description, date || rows[0].date, req.params.id]
    );
    res.json({ message: 'Transaction updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a transaction (admin/user only, must own)
const deleteTransaction = async (req, res) => {
  if (!['admin', 'user'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient privileges.' });
  }
  try {
    // Check ownership
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Transaction not found.' });
    await pool.query('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Transaction deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
}; 
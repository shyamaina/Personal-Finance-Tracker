const pool = require('../utils/db');

// Overview: total income, expense, net for period
const getOverview = async (req, res) => {
  const { year, month } = req.query;
  if (!year) return res.status(400).json({ message: 'Year is required.' });
  let dateFilter = 'YEAR(date) = ?';
  let params = [year, req.user.id];
  if (month) {
    dateFilter += ' AND MONTH(date) = ?';
    params = [year, month, req.user.id];
  }
  try {
    const [rows] = await pool.query(
      `SELECT type, SUM(amount) as total FROM transactions WHERE ${dateFilter} AND user_id = ? GROUP BY type`,
      params
    );
    let income = 0, expense = 0;
    rows.forEach(r => {
      if (r.type === 'income') income = Number(r.total);
      if (r.type === 'expense') expense = Number(r.total);
    });
    res.json({ income, expense, net: income - expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Category breakdown: sum of expenses per category
const getCategoryBreakdown = async (req, res) => {
  const { year, month } = req.query;
  if (!year) return res.status(400).json({ message: 'Year is required.' });
  let dateFilter = 'YEAR(t.date) = ?';
  let params = [year, req.user.id];
  if (month) {
    dateFilter += ' AND MONTH(t.date) = ?';
    params = [year, month, req.user.id];
  }
  try {
    const [rows] = await pool.query(
      `SELECT c.name as category, SUM(t.amount) as total FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.type = 'expense' AND ${dateFilter} AND t.user_id = ? GROUP BY c.name`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Income vs Expense: monthly totals for year
const getIncomeVsExpense = async (req, res) => {
  const { year } = req.query;
  if (!year) return res.status(400).json({ message: 'Year is required.' });
  try {
    const [rows] = await pool.query(
      `SELECT MONTH(date) as month, type, SUM(amount) as total FROM transactions WHERE YEAR(date) = ? AND user_id = ? GROUP BY MONTH(date), type`,
      [year, req.user.id]
    );
    // Format: { month: 1, income: 1000, expense: 500 }
    const result = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expense: 0 }));
    rows.forEach(r => {
      if (r.type === 'income') result[r.month - 1].income = Number(r.total);
      if (r.type === 'expense') result[r.month - 1].expense = Number(r.total);
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getOverview, getCategoryBreakdown, getIncomeVsExpense }; 
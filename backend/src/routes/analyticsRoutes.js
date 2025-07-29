const express = require('express');
const router = express.Router();
const { getOverview, getCategoryBreakdown, getIncomeVsExpense } = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: Get income, expense, and net for a period
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: Overview data
 *
 * /api/analytics/category-breakdown:
 *   get:
 *     tags: [Analytics]
 *     summary: Get expense breakdown by category
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: Category breakdown data
 *
 * /api/analytics/income-vs-expense:
 *   get:
 *     tags: [Analytics]
 *     summary: Get monthly income vs expense for a year
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Income vs expense data
 */
router.get('/overview', getOverview);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/income-vs-expense', getIncomeVsExpense);

module.exports = router; 
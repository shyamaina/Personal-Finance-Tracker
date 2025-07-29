const express = require('express');
const router = express.Router();
const { getAllCategories, addCategory } = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { categoryValidation, handleValidation } = require('../middleware/validation');

router.use(authenticateToken);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     tags: [Categories]
 *     summary: Add a new category (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category added
 *       409:
 *         description: Category already exists
 */

router.get('/', getAllCategories);
router.post('/', categoryValidation, handleValidation, addCategory);

module.exports = router; 
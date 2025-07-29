const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { transactionValidation, handleValidation } = require('../middleware/validation');

router.use(authenticateToken);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get all transactions for the logged-in user
 *     responses:
 *       200:
 *         description: List of transactions
 *   post:
 *     tags: [Transactions]
 *     summary: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, type, amount, date]
 *             properties:
 *               category_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Missing required fields
 *
 * /api/transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 *   put:
 *     tags: [Transactions]
 *     summary: Update a transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 *   delete:
 *     tags: [Transactions]
 *     summary: Delete a transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 */

router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.post('/', transactionValidation, handleValidation, createTransaction);
router.put('/:id', transactionValidation, handleValidation, updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router; 
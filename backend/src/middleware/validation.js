const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role').optional().isIn(['admin', 'user', 'read-only']).withMessage('Invalid role.')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

const transactionValidation = [
  body('category_id').isInt().withMessage('Category ID must be an integer.'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense.'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
  body('date').isISO8601().withMessage('Date must be valid (YYYY-MM-DD).'),
  body('description').optional().trim().escape()
];

const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required.').escape()
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  transactionValidation,
  categoryValidation,
  handleValidation
}; 
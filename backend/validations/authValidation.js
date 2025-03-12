import { body } from 'express-validator';

export const registerSchema = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage('Password must contain at least one uppercase letter, one number, and one special character'),
  body('avatar').optional().isString().withMessage('Invalid avatar URL'),
];

export const loginSchema = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];
import { body, param } from 'express-validator';

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Product description is required').isLength({ max: 1000 }),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required').isLength({ max: 50 }),
  body('stock').isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer'),
];

export const updateProductValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('price').optional().isFloat({ gt: 0 }),
  body('category').optional().trim().isLength({ max: 50 }),
  body('stock').optional().isInt({ gt: -1 }),
];

export const productIdValidation = [param('id').isMongoId().withMessage('Invalid product ID')];

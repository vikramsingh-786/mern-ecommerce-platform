import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
} from '../validations/productValidation.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, upload.array('images', 5), validateRequest(createProductValidation), createProduct)
  .get(getAllProducts);

router.route('/:id')
  .get(validateRequest(productIdValidation), getProductById)
  .put(protect, admin, upload.array('images', 5), validateRequest(updateProductValidation), updateProduct)
  .delete(protect, admin, validateRequest(productIdValidation), deleteProduct);

export default router;

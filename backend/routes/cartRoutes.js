import express from 'express';
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addToCart)
  .get(protect, getCart);

  router.route('/clear').delete(protect, clearCart);

router.route('/item')
  .put(protect, updateCartItem);

router.route('/item/:productId')
  .delete(protect, removeFromCart);

export default router;
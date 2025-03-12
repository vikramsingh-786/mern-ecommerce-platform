import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getAllOrders,
  deleteOrder,
  editOrderDetails
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, updateOrderToPaid)
  .delete(protect, deleteOrder);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id/edit')
  .put(protect, admin, editOrderDetails);

export default router;

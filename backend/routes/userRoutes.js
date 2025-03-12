import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getCurrentUser, // Add this import
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();
router.get('/me', protect, getCurrentUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('avatar'), updateUserProfile);

router.route('/profile/password')
  .put(protect, updatePassword);

export default router;
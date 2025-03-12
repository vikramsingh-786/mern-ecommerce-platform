import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  editUser,
  deleteUser,
  getUserById,
} from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import upload from "../utils/upload.js";
import { admin, authLimiter, protect } from "../middleware/authMiddleware.js";
import contactUs from "../controllers/contactController.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  validateRequest(registerSchema),
  registerUser
);
router.post("/login", authLimiter, validateRequest(loginSchema), loginUser);
router.post("/logout", logoutUser);

router.get("/users", protect, admin, getAllUsers);
router.put("/users/:id", protect, admin, editUser);
router.delete("/users/:id", protect, admin, deleteUser);
router.get('/users/:id', protect, admin, getUserById);
router.post("/contact", contactUs);

export default router;

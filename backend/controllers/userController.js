import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.file) {
    if (user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }
    
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { folder: 'User-Avatars' }
    );
    
    user.avatar = {
      public_id: result.public_id,
      secure_url: result.secure_url
    };
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    role: updatedUser.role
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;
  
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
  
    user.password = newPassword;
    await user.save();
  
    res.json({ message: 'Password updated successfully' });
});
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); // Exclude password from the response
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  });
});


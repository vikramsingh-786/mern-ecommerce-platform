import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken, { generateRefreshToken } from '../utils/generateToken.js';
import cloudinary from '../config/cloudinary.js';
// Register User
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let avatar = { public_id: '', secure_url: '' };
    if (req.file) {
      try {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'User-Avatars',
        });
        avatar = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return res.status(500).json({ message: 'Error uploading avatar' });
      }
    }

    const user = await User.create({
      name,
      email,
      password, 
      avatar,
    });

    // Responding with user wrapped in 'user' object
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Responding with user wrapped in 'user' object
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logout successful' });
});
// View All Users (Admin Only)
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const users = await User.find({}).select('-password'); // Exclude passwords from the response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Edit User (Admin Only)
export const editUser = asyncHandler(async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    // Handle avatar update if a file is uploaded
    if (req.file) {
      try {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'User-Avatars',
        });
        user.avatar = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return res.status(500).json({ message: 'Error uploading avatar' });
      }
    }

    await user.save();

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Delete User (Admin Only)
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user's avatar from Cloudinary if it exists
    if (user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    await User.deleteOne({ _id: id });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});
// Get User by ID (Admin Only)
export const getUserById = asyncHandler(async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const { id } = req.params;

    const user = await User.findById(id).select('-password'); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});
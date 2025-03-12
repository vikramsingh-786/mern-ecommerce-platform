// controllers/categoryController.js
import Category from '../models/Category.js';
import asyncHandler from 'express-async-handler';

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, category });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  category ? res.json(category) : res.status(404).json({ message: 'Category not found' });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  if (name) category.name = name;
  if (description) category.description = description;
  await category.save();
  res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  category ? res.json({ message: 'Category deleted successfully' }) : res.status(404).json({ message: 'Category not found' });
});
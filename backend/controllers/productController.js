import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import Category from '../models/Category.js';

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  // Check if the category exists
  const categoryExists = await Category.findOne({ name: category });
  if (!categoryExists) {
    return res.status(400).json({ success: false, message: "Category does not exist" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "Missing required parameter - file" });
  }

  let imageUploads = [];

  if (req.files.length) {
    imageUploads = await Promise.all(
      req.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                resolve({ public_id: result.public_id, url: result.secure_url });
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images: imageUploads,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, category, stock } = req.body;

  // Check if the category exists
  if (category) {
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Category does not exist" });
    }
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (req.files?.length) {
    await Promise.all(product.images.map(img => cloudinary.uploader.destroy(img.public_id)));

    const imageUploads = await Promise.all(
      req.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(new Error(error.message));
              else resolve({ public_id: result.public_id, url: result.secure_url });
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );
    product.images = imageUploads;
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (stock) product.stock = stock;

  await product.save();
  res.json({ success: true, product });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  product ? res.json({ message: 'Product deleted successfully' }) : res.status(404).json({ message: 'Product not found' });
});

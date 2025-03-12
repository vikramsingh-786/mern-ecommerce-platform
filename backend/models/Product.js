import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"] },

    description: { type: String, required: [true, "Product description is required"] },
    price: { type: Number, required: true, min: [0.01, "Price must be a positive number"] },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: { type: String, required: [true, "Category is required"] },
    stock: { type: Number, required: true, min: [0, "Stock must be a non-negative integer"] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
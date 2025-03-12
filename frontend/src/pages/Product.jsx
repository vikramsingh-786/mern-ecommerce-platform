import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { useTheme } from "../contexts/ThemeContext";
import { FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation } from "../api/cartApi";
import { useFetchProductByIdQuery } from "../api/productApi";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext"; 

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const { updateCartCount } = useCart(); 

  const { data: product, isLoading } = useFetchProductByIdQuery(id);
  const { data: cartData, refetch } = useGetCartQuery();
  const [addToCartApi] = useAddToCartMutation();
  const [updateCartItemApi] = useUpdateCartItemMutation();

  const cartItems = cartData?.items || [];
  const cartItem = cartItems.find((item) => item._id === id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (cartItem) {
        await updateCartItemApi({ productId: product._id, quantity }).unwrap();
        toast.success("Cart updated successfully!");
      } else {
        await addToCartApi({ productId: product._id, quantity }).unwrap();
      }
      refetch();
      updateCartCount(cartItems.length + 1); 
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className={`min-h-screen p-8 py-20 ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
            : "bg-gradient-to-br from-emerald-50 to-teal-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="sticky top-8">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
                />
              </div>
            </div>

            <div className="md:w-1/2 space-y-6">
              <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">{product.category}</span>
                <h1 className="text-3xl font-bold mt-4 mb-6">{product.name}</h1>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl">Price</span>
                    <span className="text-3xl font-bold text-blue-500">${product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl">Stock</span>
                    <span className={`px-3 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {product.stock} units available
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{product.description}</p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Quantity</h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      max={product.stock}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-20 text-center py-2 px-3 border rounded-lg"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    {cartItem ? "Update Cart" : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors text-lg font-semibold"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
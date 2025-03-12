import React, { useEffect, useState } from "react";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } from "../api/cartApi";
import { Trash2, AlertCircle, ShoppingCart, Plus, Minus } from "lucide-react";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext"; 

const Cart = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { data: cartData, isLoading, isError, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCartApi] = useClearCartMutation();
  const { updateCartCount, clearCartState } = useCart(); 

  // Local state to store cart items
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    refetch(); // Refetch cart data when the component mounts
  }, [refetch]);

  useEffect(() => {
    if (cartData?.items) {
      const items = cartData.items
        .filter(cartItem => cartItem.product) // Filter out null products
        .map((cartItem) => ({
          _id: cartItem.product._id,
          name: cartItem.product.name,
          price: cartItem.product.price,
          images: cartItem.product.images,
          stock: cartItem.product.stock,
          quantity: cartItem.quantity,
          description: cartItem.product.description,
        }));
  
      setCartItems(items);
      setTotalPrice(items.reduce((acc, item) => acc + item.price * item.quantity, 0));
  
      // Update the global cart count
      const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
      updateCartCount(totalQuantity);
    } else {
      // If no items, reset the cart
      setCartItems([]);
      setTotalPrice(0);
      updateCartCount(0);
    }
  }, [cartData, updateCartCount]);

  const handleUpdateQuantity = async (id, newQuantity, stock) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    if (newQuantity > stock) {
      toast.error("Cannot exceed available stock");
      return;
    }
    try {
      await updateCartItem({ productId: id, quantity: newQuantity }).unwrap();
      refetch(); // Refetch cart data immediately
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id).unwrap();
      refetch(); // Refetch cart data immediately
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartApi().unwrap();
      refetch(); // Refetch cart data immediately
      setCartItems([]); // Clear local state
      setTotalPrice(0); // Clear local state
      updateCartCount(0); // Reset the global cart count
      clearCartState(); // Clear the cart state in context
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    console.log("Navigating with state:", { cartItems, totalPrice }); // Debugging
    navigate("/order/create", { state: { cartItems, totalPrice } });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cart</div>;

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto p-6 space-y-8 mt-5 mb-5 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" /> Shopping Cart ({cartItems.length} items)
        </h1>
        {cartItems.length === 0 ? (
          <div className={`p-6 rounded-lg flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-yellow-100"}`}>
            <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
            <p className="text-lg">Your cart is empty. Start shopping!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`border rounded-lg shadow-lg overflow-hidden ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                    <div className="p-6 flex gap-6">
                      <img src={item.images[0]?.url || "fallback-image.jpg"} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <p className="text-lg font-medium">${item.price}</p>
                        <p className="text-sm text-gray-500">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Stock: {item.stock} available</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1, item.stock)}
                            disabled={item.quantity <= 1} className="p-1 rounded-md bg-gray-200 hover:bg-gray-300">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1, item.stock)}
                            disabled={item.quantity >= item.stock} className="p-1 rounded-md bg-gray-200 hover:bg-gray-300">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => handleRemove(item._id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="mt-8 space-y-6">
              <div className={`border rounded-lg shadow-lg overflow-hidden ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between text-lg">
                      <span>Total Items</span>
                      <span>{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between text-xl font-semibold">
                      <span>Total Price</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                      <button onClick={handleClearCart} className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> Clear Cart
                      </button>
                      <button onClick={handleCheckout} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1 sm:flex-none flex items-center justify-center gap-2">
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
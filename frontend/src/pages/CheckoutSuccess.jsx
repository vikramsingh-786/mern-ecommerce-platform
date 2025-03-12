import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Layout from "../components/Layout";
import { useTheme } from "../contexts/ThemeContext";
import successImage from "../assets/order-confirmation.avif";
import { useCart } from "../contexts/CartContext";

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { cartCount } = useCart();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <Layout>
      <div
        className={`max-w-4xl mx-auto p-6 space-y-8 mt-5 mb-5 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div
          className={`border rounded-lg shadow-lg overflow-hidden ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <div className="p-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Left Side: Success Message */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h1 className="text-3xl font-bold">Payment Successful!</h1>
              <p className="text-lg">Thank you for your purchase.</p>
              <p className="text-sm text-gray-500">Order ID: {orderId}</p>
              <p className="text-sm text-gray-500">Items in Cart: {cartCount}</p>
              <button
                onClick={() => navigate("/products")}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>

            {/* Right Side: Image */}
            <div className="flex-shrink-0">
              <img
                src={successImage} 
                alt="Payment Successful"
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import failedImage from "../assets/paymentfailed.avif"; 

const CheckoutFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full text-gray-900 dark:text-white">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-3xl font-bold mt-4">Payment Failed</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Oops! Something went wrong. Please try again or contact support.
        </p>
        <img
          src={failedImage}
          alt="Payment Failed"
          className="w-48 h-48 mx-auto mt-4 object-contain"
        />
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Go Back to Cart
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full p-3 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailed;
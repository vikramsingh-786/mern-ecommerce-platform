import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCreatePaymentIntentMutation } from "../api/paymentApi";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Layout from "../components/Layout";
import StripePaymentForm from "./StripePaymentForm";
import { useCart } from "../contexts/CartContext"; // Import useCart

const stripePromise = loadStripe(
  "pk_test_51NqSFpSFYMvNlGolwbo7pZruNHeyLiXW6CgNeFjJUM5nw8YBWkl6BlYNxi1KBHHdmgcWI578E5rn0R7zmOINW2Cj00qdItp4rb"
);

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { state: { orderId, totalPrice, shippingAddress, cartItems } = {} } =
    useLocation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const { clearCartState, refetch } = useCart();

  useEffect(() => {
    if (!orderId || !totalPrice || !shippingAddress) {
      toast.error("Missing order details");
      navigate("/cart");
      return;
    }

    const createPayment = async () => {
      try {
        setLoading(true);
        const paymentIntentResponse = await createPaymentIntent({
          amount: Math.round(totalPrice),
          currency: "inr",
          orderId,
          billingDetails: {
            name: shippingAddress.name || "Customer Name",
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country || "IN",
          },
        }).unwrap();

        setClientSecret(paymentIntentResponse.clientSecret);
      } catch (error) {
        console.error("Payment Intent Error:", error);
        toast.error(error.data?.error || "Failed to initiate payment");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    createPayment();
  }, [orderId, totalPrice, shippingAddress, createPaymentIntent, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  const appearance = {
    theme: darkMode ? "night" : "stripe",
    variables: {
      colorPrimary: "#0284c7",
    },
  };

  return (
    <Layout>
      <div
        className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Secure Checkout
          </h1>

          {/* Order Summary Section */}
          <div
            className={`rounded-lg shadow-lg overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`py-4 px-6 ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
            >
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Order Summary
              </h2>
            </div>
            <div className="p-6">
              {cartItems && cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className={`flex items-center gap-4 pb-4 border-b ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={
                            (item.images && item.images[0]?.url) ||
                            "/placeholder-product.jpg"
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-md font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div
                        className={`text-md font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <div
                    className={`pt-4 space-y-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-sm">Shipping</span>
                      <span className="text-sm font-medium">$50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-sm font-medium">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-dashed">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No items in order
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address Section */}
          <div
            className={`rounded-lg shadow-lg overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`py-4 px-6 ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
            >
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Shipping Information
              </h2>
            </div>
            <div className="p-6">
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p
                    className={`text-md ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {shippingAddress?.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p
                    className={`text-md ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {shippingAddress?.address || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">City</p>
                  <p
                    className={`text-md ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {shippingAddress?.city || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Postal Code</p>
                  <p
                    className={`text-md ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {shippingAddress?.postalCode || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Country</p>
                  <p
                    className={`text-md ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {shippingAddress?.country || "IN"}
                  </p>
                </div>
                {shippingAddress?.phone && (
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p
                      className={`text-md ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {shippingAddress.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Form Section */}
          {clientSecret && (
            <div
              className={`rounded-lg shadow-lg overflow-hidden ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`py-4 px-6 ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Payment Details
                </h2>
              </div>
              <div className="p-6">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance,
                    loader: "auto",
                  }}
                >
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    billingDetails={shippingAddress}
                    onSuccess={() => {
                      clearCartState(); // Clear the cart state
                      toast.success("Payment successful!");
                      navigate("/checkout/success", { state: { orderId } });
                      refetch(); 
                    }}
                    onError={(error) => {
                      toast.error(error.message || "Payment failed");
                      navigate("/checkout/failed");
                    }}
                    darkMode={darkMode}
                    refetch={refetch} // Pass refetch as a prop
                    clearCartState={clearCartState} // Pass clearCartState as a prop
                  />
                </Elements>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutScreen;

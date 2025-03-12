import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCreateOrderMutation } from "../api/orderApi";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";
import {
  PackageSearch,
  Truck,
  CreditCard,
  Receipt,
  Trash2,
  DollarSign,
} from "lucide-react";
import Layout from "../components/Layout";

const CreateOrderScreen = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { state: { cartItems = [], totalPrice = 0 } = {} } = useLocation();
  const [createOrder] = useCreateOrderMutation();

  const initialAddressState = {
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "IN", 
    email: "", 
    phone: "", 
  };

  const [orderData, setOrderData] = useState({
    items:
      cartItems?.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      })) || [],
    shippingAddress: initialAddressState,
    paymentMethod: "Stripe",
    itemsPrice: totalPrice,
    shippingPrice: 50,
    totalPrice: totalPrice + 50,
  });

  const [addressErrors, setAddressErrors] = useState(initialAddressState);

  useEffect(() => {
    if (!cartItems?.length) {
      toast.error("Your cart is empty!");
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const updateOrderData = (field, value) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    updateOrderData("shippingAddress", {
      ...orderData.shippingAddress,
      [field]: value,
    });

    if (value.trim()) {
      setAddressErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    let isValid = true;

    Object.entries(orderData.shippingAddress).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
      }
    });

    setAddressErrors(newErrors);
    return isValid;
  };

  // In CreateOrderScreen.js
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddress()) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    try {
      // Step 1: Create Order
      const orderResponse = await createOrder(orderData).unwrap();
      const orderId = orderResponse._id;

      // Step 2: Navigate to Checkout Page with all required data
      navigate("/checkout", {
        state: {
          orderId,
          cartItems,
          totalPrice: orderData.totalPrice,
          shippingAddress: {
            name: orderData.shippingAddress.name || "Customer Name",
            address: orderData.shippingAddress.address,
            city: orderData.shippingAddress.city,
            postalCode: orderData.shippingAddress.postalCode,
            country: orderData.shippingAddress.country || "IN",
            email: orderData.shippingAddress.email, 
            phone: orderData.shippingAddress.phone, 
          },
        },
      });
    } catch (error) {
      toast.error("Failed to create order");
      console.error("Error:", error);
    }
  };

  const removeItem = (index) => {
    const updatedItems = orderData.items.filter((_, i) => i !== index);
    const newItemsPrice = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setOrderData((prev) => ({
      ...prev,
      items: updatedItems,
      itemsPrice: newItemsPrice,
      totalPrice: newItemsPrice + prev.shippingPrice,
    }));
  };

  const renderInput = (placeholder, value, onChange, error = "") => (
    <div>
      <input
        className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white"
              : "border-gray-300"
          }
          ${error ? "border-red-500" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
    </div>
  );

  const renderSection = (title, icon, content) => (
    <div
      className={`rounded-lg shadow-sm ${
        darkMode ? "bg-slate-800 text-white" : "bg-white"
      }`}
    >
      <div className="border-b border-gray-200 p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {icon}
          {title}
        </h2>
      </div>
      <div className="p-4">{content}</div>
    </div>
  );

  return (
    <Layout>
      <div
        className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
          darkMode ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Create New Order
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderSection(
              "Order Items",
              <PackageSearch className="h-5 w-5" />,
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        className={`w-full px-3 py-2 rounded-md border ${
                          darkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "border-gray-300"
                        }`}
                        value={item.product}
                        readOnly
                      />
                    </div>
                    <input
                      type="number"
                      className={`w-24 px-3 py-2 rounded-md border ${
                        darkMode
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "border-gray-300"
                      }`}
                      value={item.quantity}
                      readOnly
                    />
                    <input
                      type="number"
                      className={`w-32 px-3 py-2 rounded-md border ${
                        darkMode
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "border-gray-300"
                      }`}
                      value={item.price}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {renderSection(
              "Shipping Address",
              <Truck className="h-5 w-5" />,
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { field: "name", span: "col-span-2" },
                  { field: "email", span: "col-span-2" },
                  { field: "phone", span: "col-span-1" },
                  { field: "address", span: "col-span-2" },
                  { field: "city", span: "col-span-1" },
                  { field: "postalCode", span: "col-span-1" },
                  { field: "country", span: "col-span-2" },
                ].map(({ field, span }) => (
                  <div key={field} className={span}>
                    {renderInput(
                      `${field.charAt(0).toUpperCase() + field.slice(1)} *`,
                      orderData.shippingAddress[field],
                      (newValue) => handleAddressChange(field, newValue),
                      addressErrors[field]
                    )}
                  </div>
                ))}
              </div>
            )}

            {renderSection(
              "Payment Method",
              <CreditCard className="h-5 w-5" />,
              <select
                value={orderData.paymentMethod}
                onChange={(e) =>
                  updateOrderData("paymentMethod", e.target.value)
                }
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "border-gray-300"
                }`}
              >
                <option value="Stripe">Stripe</option>
              </select>
            )}

            {renderSection(
              "Order Summary",
              <Receipt className="h-5 w-5" />,
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Items Total",
                      value: orderData.itemsPrice,
                      icon: <DollarSign className="h-4 w-4" />,
                    },
                    {
                      label: "Shipping",
                      value: orderData.shippingPrice,
                      icon: <Truck className="h-4 w-4" />,
                    },
                  ].map(({ label, value, icon }) => (
                    <div key={label}>
                      <label className="block text-sm font-medium mb-2">
                        {label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">{icon}</span>
                        <input
                          type="number"
                          className={`w-full pl-8 pr-3 py-2 rounded-md border ${
                            darkMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "border-gray-300"
                          }`}
                          value={value}
                          readOnly
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4" />
                    <input
                      type="number"
                      className={`w-full pl-8 pr-3 py-2 rounded-md border ${
                        darkMode
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "border-gray-300"
                      }`}
                      value={orderData.totalPrice}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className={`w-full px-6 py-3 ${
                  darkMode ? "bg-green-600" : "bg-green-500"
                }
                  text-white rounded-md font-medium hover:bg-green-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50`}
                disabled={Object.values(orderData.shippingAddress).some(
                  (value) => !value.trim()
                )}
              >
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrderScreen;

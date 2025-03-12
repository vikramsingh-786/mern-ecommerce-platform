import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Headset, MessageCircle, ShoppingCart, X, RefreshCw } from "lucide-react";
import Button from "../components/Button";
import UserHeader from "../components/User/UserHeader";
import { useGetMyOrdersQuery, useGetOrderByIdQuery } from "../api/orderApi";
import OrderHistory from "../components/User/OrderHistory";
import ReturnsAndRefunds from "../components/User/ReturnsAndRefunds"; 

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const { darkMode } = useTheme();
  const userInfoFromStorage = localStorage.getItem("user");
  const userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null;

  // Fetch user orders
  const { data: userOrders } = useGetMyOrdersQuery();

  // Fetch detailed order information
  const { data: detailedOrder } = useGetOrderByIdQuery(selectedOrder?._id, {
    skip: !selectedOrder, // Skip the query if no order is selected
  });

  // Function to show order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  // Function to close details
  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Function to open support modal
  const handleOpenSupport = () => {
    setIsSupportModalOpen(true);
  };

  // Function to close support modal
  const handleCloseSupport = () => {
    setIsSupportModalOpen(false);
  };

  // Function to open chatbot modal
  const handleOpenChatbot = () => {
    setIsChatbotOpen(true);
  };

  // Function to close chatbot modal
  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  // Function to handle user input and chatbot response
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat
    setChatMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    // Generate chatbot response
    const response = generateChatbotResponse(userInput);
    setChatMessages((prev) => [...prev, { sender: "bot", text: response }]);

    // Clear input
    setUserInput("");
  };

  const generateChatbotResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("order status")) {
      return "You can check your order status in the 'Order History' section.";
    } else if (lowerInput.includes("payment issue")) {
      return "For payment issues, please contact support at bobvik2003@gmail.com.";
    } else if (lowerInput.includes("shipping")) {
      return "Shipping usually takes 3-5 business days. You can track your order in the 'Order History' section.";
    } else if (lowerInput.includes("return")) {
      return "To initiate a return, please visit the 'Returns & Refunds' section in your account.";
    } else {
      return "I'm here to help! Please ask me about order status, payment issues, shipping or returns.";
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      <UserHeader setIsSidebarOpen={setIsSidebarOpen} userInfo={userInfo} />

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 top-16 z-20 w-64 transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          backdrop-blur-md bg-opacity-30 ${
            darkMode
              ? "bg-gray-800/70 shadow-lg shadow-gray-900/50"
              : "bg-white/70 shadow-lg shadow-gray-200/50"
          }
          border-r ${darkMode ? "border-gray-700/50" : "border-gray-200/50"}`}
      >
        <nav className="p-4 space-y-2 relative z-10">
          {/* Orders Tab */}
          <Button
            variant={activeTab === "orders" ? "primary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Button>

          {/* Returns & Refunds Tab */}
          <Button
            variant={activeTab === "returns" ? "primary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("returns")}
          >
            <RefreshCw size={20} /> {/* Added RefreshCw icon */}
            <span>Returns & Refunds</span>
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-16">
        <div className="max-w-7xl mx-auto">
          {/* Render OrderHistory or ReturnsAndRefunds based on activeTab */}
          {activeTab === "orders" ? (
            <OrderHistory
              userOrders={userOrders}
              handleViewDetails={handleViewDetails}
              userInfo={userInfo}
            />
          ) : (
            <ReturnsAndRefunds />
          )}
        </div>
      </main>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="secondary"
          className="flex items-center gap-2 mb-10"
          onClick={handleOpenSupport}
        >
          <Headset size={20} />
          Contact Support
        </Button>
        <Button
          variant="primary"
          className="flex items-center gap-2 mb-10"
          onClick={handleOpenChatbot}
        >
          <MessageCircle size={20} />
          Chat with Bot
        </Button>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Order Details</h3>
              <button onClick={handleCloseDetails}>
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Total Cost:</strong> ${selectedOrder.totalPrice}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            <p>
              <strong>Paid At:</strong>{" "}
              {new Date(selectedOrder.paidAt).toLocaleString()}
            </p>
            <p>
              <strong>Shipping Address:</strong>
            </p>
            <p>
              {selectedOrder.shippingAddress.address},{" "}
              {selectedOrder.shippingAddress.city},{" "}
              {selectedOrder.shippingAddress.postalCode}
            </p>

            <h4 className="mt-4 font-semibold">Items:</h4>
            <ul>
              {detailedOrder?.items.map((item, index) => (
                <li key={index} className="border-t py-2">
                  <p>
                    <strong>Product:</strong>{" "}
                    {item.product?.name || "Product Name Not Available"}
                  </p>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                </li>
              ))}
            </ul>

            <Button
              variant="primary"
              className="mt-4 w-full flex justify-center"
              onClick={handleCloseDetails}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Contact Support</h3>
              <button onClick={handleCloseSupport}>
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any issues, please contact support at:
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              bobvik2003@gmail.com
            </p>
            <Button
              variant="primary"
              className="mt-4 w-full flex justify-center"
              onClick={handleCloseSupport}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      {isChatbotOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">E-Commerce Bot</h3>
              <button onClick={handleCloseChatbot}>
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="h-64 overflow-y-auto mb-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ask me anything..."
              />
              <Button type="submit" variant="primary">
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
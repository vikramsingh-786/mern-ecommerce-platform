import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Card from "../Card";
import Button from "../Button";

const OrderHistory = ({ userOrders, handleViewDetails, userInfo }) => {
  const { darkMode } = useTheme();
  // Filter orders for the currently logged-in user
  const filteredOrders = userOrders?.filter(
    (order) => order.user === userInfo?._id
  );

  // Function to handle return request
  const handleReturn = (orderId) => {
    console.log("Return requested for order:", orderId);
    // Add logic to handle return request
  };

  // Function to handle cancel request
  const handleCancel = (orderId) => {
    console.log("Cancel requested for order:", orderId);
    // Add logic to handle cancel request
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Order History
        </h3>
        {filteredOrders?.length ? (
          <div className="overflow-x-auto">
            <table
              className={`min-w-full divide-y ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                <tr>
                  {[
                    "Order ID",
                    "Total Cost",
                    "Status",
                    "Payment Method",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700 bg-gray-900" : "divide-gray-200 bg-white"
                }`}
              >
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className={darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm font-medium">{order._id}</td>
                    <td className="px-6 py-4 text-sm">${order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === "pending"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{order.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <Button
                        variant="primary"
                        className="inline-flex items-center gap-2"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </Button>
                      {/* Render Return button for delivered orders */}
                      {order.status === "delivered" && (
                        <Button
                          variant="secondary"
                          className="inline-flex items-center gap-2"
                          onClick={() => handleReturn(order._id)}
                        >
                          Return
                        </Button>
                      )}
                      {/* Render Cancel button for non-delivered orders */}
                      {order.status !== "delivered" && (
                        <Button
                          variant="danger"
                          className="inline-flex items-center gap-2"
                          onClick={() => handleCancel(order._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              No past orders found.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderHistory;
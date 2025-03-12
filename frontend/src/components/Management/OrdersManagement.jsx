import React, { useState } from "react";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../api/orderApi";
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Eye,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Button from "../Button";

const OrdersManagement = () => {
  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
  } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const { darkMode } = useTheme();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };
  const handleDelete = async () => {
    try {
      await deleteOrder(selectedOrder._id).unwrap();
      toast.success("Order deleted successfully");
      setIsDeleteModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const getFilteredOrders = () => {
    if (!orderData?.orders) return [];
    if (statusFilter === "all") return orderData.orders;
    return orderData.orders.filter((order) => order.status === statusFilter);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <XCircle className="w-8 h-8 mr-2" />
        <span>Error loading orders</span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header and Stats */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-6 text-center">
            Orders Management
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Orders",
                value: orderData?.stats?.totalOrders,
                icon: <Package className="text-blue-500" />,
              },
              {
                title: "Total Sales",
                value: `$${orderData?.stats?.totalSales.toFixed(2)}`,
                icon: <DollarSign className="text-green-500" />,
              },
              {
                title: "Paid Orders",
                value: orderData?.stats?.paidOrders,
                icon: <CheckCircle className="text-green-500" />,
              },
              {
                title: "Unpaid Orders",
                value: orderData?.stats?.unpaidOrders,
                icon: <Clock className="text-yellow-500" />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-md flex items-center justify-between transform transition-all duration-300 hover:scale-105 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="w-10 h-10">{stat.icon}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            {[
              "all",
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ].map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table
            className={`w-full text-left rounded-lg overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <thead
              className={`${
                darkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Total",
                  "Status",
                  "Payment",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredOrders().map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-mono">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-lg border ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {[
                        "pending",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.isPaid
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                  <Button // Use your custom Button component
                      onClick={() =>
                        (window.location.href = `/orders/${order._id}`)
                      }
                      className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700" 
                    >
                      <Eye className="h-4 w-4" /> 
                    </Button>
                    <Button // Use your custom Button component
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDeleteModalOpen(true);
                      }}
                      className="rounded p-2 hover:bg-red-100 dark:hover:bg-red-900" 
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Order"
        >
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this order? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OrdersManagement;

import React, { useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../api/orderApi";
import { useFetchAllProductsQuery } from "../api/productApi";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  BarChart2,
  Settings,
  DollarSign,
  Clock,
  CheckCircle,
  RefreshCw,
  Edit,
  Trash2,
  List,
} from "lucide-react";
import ProductManagement from "../components/Management/ProductManagement";
import UserManagement from "../components/Management/UserManagement";
import OrdersManagement from "../components/Management/OrdersManagement";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import AdminHeader from "../components/Admin/AdminHeader";
import EditableStatus from "../components/EditableStatus";
import CategoryManagement from "../components/Management/CategoryManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { darkMode } = useTheme();

  const { data: orderData, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: products, isLoading: productsLoading } =
    useFetchAllProductsQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const userInfoFromStorage = localStorage.getItem("user");
  const userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null;

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      // Implement delete logic here
      toast.success("Order deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const metrics = React.useMemo(() => {
    if (!orderData?.orders || !products) return null;

    const totalRevenue = orderData.orders.reduce(
      (sum, order) => sum + (order.isPaid ? order.totalPrice : 0),
      0
    );

    return {
      totalRevenue,
      activeOrders: orderData.orders.filter(
        (order) => !["delivered", "cancelled"].includes(order.status)
      ).length,
      completedOrders: orderData.orders.filter(
        (order) => order.status === "delivered"
      ).length,
      totalProducts: products.length,
      totalUsers: userInfo?.totalUsers || 1200,
      subscribedUsers: userInfo?.subscribedUsers || 850,
    };
  }, [orderData, products, userInfo]);

  const statsCards = metrics
    ? [
        {
          title: "Total Revenue",
          value: `$${metrics.totalRevenue.toLocaleString()}`,
          icon: <DollarSign className="text-green-500" size={24} />,
          change: "+20.1%",
          trend: "up",
        },
        {
          title: "Active Orders",
          value: metrics.activeOrders,
          icon: <Clock className="text-blue-500" size={24} />,
          change: "+12.5%",
          trend: "up",
        },
        {
          title: "Completed Orders",
          value: metrics.completedOrders,
          icon: <CheckCircle className="text-purple-500" size={24} />,
          change: "+8.2%",
          trend: "up",
        },
        {
          title: "Total Products",
          value: metrics.totalProducts,
          icon: <Package className="text-yellow-500" size={24} />,
          change: "+5",
          trend: "up",
        },
      ]
    : [];

    const renderContent = () => {
      switch (activeTab) {
        case "overview":
          return (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <Card key={index}>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">{stat.title}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          <p
                            className={`text-sm mt-2 ${
                              stat.trend === "up"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {stat.change} from last month
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-opacity-20">
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
    
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={
                            orderData?.orders?.map((order) => ({
                              month: new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short" }
                              ),
                              revenue: order.totalPrice,
                            })) || []
                          }
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#4F46E5"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
    
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">User Distribution</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Total Users", value: metrics?.totalUsers },
                              {
                                name: "Subscribed Users",
                                value: metrics?.subscribedUsers,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {["#4F46E5", "#10B981"].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </div>
    
              {/* Orders Table */}
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                    <Button variant="primary">View All</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Order ID</th>
                          <th className="text-left p-4">Customer</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Amount</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData?.orders?.slice(0, 5).map((order) => (
                          <tr key={order._id} className="border-b">
                            <td className="p-4">#{order._id.slice(-6)}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  {order.user.name.charAt(0)}
                                </div>
                                {order.user.name}
                              </div>
                            </td>
                            <td className="p-4">
                              <EditableStatus
                                status={order.status}
                                onStatusChange={(newStatus) =>
                                  handleStatusUpdate(order._id, newStatus)
                                }
                                darkMode={darkMode}
                              />
                            </td>
                            <td className="p-4">
                              ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedOrderId(order._id);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          );
    
        case "products":
          return <ProductManagement />;
    
        case "users":
          return <UserManagement />;
    
        case "orders":
          return <OrdersManagement />;
    
        case "categories": 
          return <CategoryManagement />;
    
        default:
          return (
            <div className="p-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h3>
                  <p className="text-gray-500 mt-2">
                    This section is under development.
                  </p>
                </div>
              </Card>
            </div>
          );
      }
    };

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      <AdminHeader setIsSidebarOpen={setIsSidebarOpen} userInfo={userInfo} />
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
        <div className="absolute inset-0 -z-10 backdrop-blur-md" />
        <nav className="p-4 space-y-2 relative z-10">
          {[
            {
              id: "overview",
              label: "Dashboard",
              icon: <LayoutDashboard size={20} />,
            },
            { id: "products", label: "Products", icon: <Package size={20} /> },
            { id: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
            { id: "users", label: "Users", icon: <Users size={20} /> },
            { id: "categories", label: "Categories", icon: <List size={20} /> }, // New tab
            {
              id: "payments",
              label: "Payments",
              icon: <CreditCard size={20} />,
            },
            { id: "shipping", label: "Shipping", icon: <Truck size={20} /> },
            {
              id: "reports",
              label: "Analytics",
              icon: <BarChart2 size={20} />,
            },
            { id: "settings", label: "Settings", icon: <Settings size={20} /> },
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "primary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-16">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Order"
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteOrder}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this order? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

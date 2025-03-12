import React, { useEffect, useState } from "react";
import {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../api/userApi";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Edit,
  Trash2,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCircle,
  Mail,
} from "lucide-react";
import Modal from "../Modal";
import { LoadingSpinner, PageLoader } from "../LoadingSpinner";

const UserManagement = () => {
  const { darkMode } = useTheme();
  const [page, setPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUsersQuery({ page, limit: 10 });
  const { data: selectedUser, isLoading: isUserLoading } = useGetUserByIdQuery(
    selectedUserId,
    {
      skip: !selectedUserId,
    }
  );
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Filter users based on search query
  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser({ userId: selectedUserId, userData: formData }).unwrap();
      toast.success("User updated successfully");
      handleCloseEditModal();
      refetch();
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedUser && isEditModalOpen) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
  }, [selectedUser, isEditModalOpen]);

  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
    setFormData({ name: "", email: "", role: "" });
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUserId).unwrap();
      toast.success("User deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
      refetch();
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="mx-auto max-w-7xl p-4 sm:p-6 space-y-6">
        {/* Loading Overlay */}
        {isFetching && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 transition-all duration-200">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-md">
              <LoadingSpinner size="large" />
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="grid gap-4 md:grid-cols-2 items-center">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              User Management
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your system users and their roles
            </p>
          </div>
          <div className="relative">
            <div className="relative max-w-md ml-auto">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg pl-10 pr-4 py-2.5 transition-all duration-200
                  ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700 focus:bg-gray-800 focus:border-blue-500"
                      : "bg-white/50 border-gray-300 focus:bg-white focus:border-blue-400"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm`}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <div
              className={`overflow-x-auto ${
                darkMode ? "bg-gray-800/50" : "bg-white/50"
              }`}
            >
              <table className="w-full border-collapse">
                <thead
                  className={darkMode ? "bg-gray-700/50" : "bg-gray-50/50"}
                >
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium">
                      Role
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers?.map((user) => (
                    <tr
                      key={user._id}
                      className={`group transition-colors duration-200 ${
                        darkMode
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
                          ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(user._id)}
                            className={`p-2 rounded-lg transition-colors duration-200 
        ${darkMode ? "hover:bg-gray-600/50" : "hover:bg-gray-100"}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserId(user._id);
                              setIsDeleteModalOpen(true);
                            }}
                            className={`p-2 rounded-lg transition-colors duration-200
        ${darkMode ? "hover:bg-red-900/50" : "hover:bg-red-100"}`}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card layout for mobile */}
          <div className="md:hidden space-y-4">
            {filteredUsers?.map((user) => (
              <div
                key={user._id}
                className={`p-4 rounded-lg border transition-all duration-200
                  ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                      : "bg-white/50 border-gray-200 hover:bg-gray-50/50"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
                    ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </span>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className={`p-2 rounded-lg transition-colors duration-200
                      ${
                        darkMode ? "hover:bg-gray-600/50" : "hover:bg-gray-100"
                      }`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className={`p-2 rounded-lg transition-colors duration-200
                      ${darkMode ? "hover:bg-red-900/50" : "hover:bg-red-100"}`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200
                ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50"
                    : "bg-white hover:bg-gray-50 disabled:bg-gray-100/50"
                } disabled:cursor-not-allowed`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span
              className={`px-4 py-2 rounded-lg 
              ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!users || users.length < 10}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200
                ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50"
                    : "bg-white hover:bg-gray-50 disabled:bg-gray-100/50"
                } disabled:cursor-not-allowed`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Enhanced Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit User"
        >
          <div className="relative">
            {(isUserLoading || isSubmitting) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm z-10 rounded-lg">
                <LoadingSpinner size="default" />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg pl-10 pr-4 py-2.5 transition-all duration-200
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-400"
                        } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      required
                    />
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg pl-10 pr-4 py-2.5 transition-all duration-200
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-400"
                        } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      required
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg pl-10 pr-4 py-2.5 transition-all duration-200
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-400"
                        } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg transition-all duration-200
                    ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50"
                        : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200/50"
                    } disabled:cursor-not-allowed`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 
                    text-white px-6 py-2 rounded-lg flex items-center gap-2 
                    transition-all duration-200 disabled:cursor-not-allowed`}
                >
                  {isSubmitting && <LoadingSpinner size="small" />}
                  <span>Update</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Enhanced Delete Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete User"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Confirm Deletion</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this user? This action cannot
                  be undone and will permanently remove the user's data from the
                  system.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg 
                  flex items-center gap-2 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* No Results State */}
        {filteredUsers?.length === 0 && (
          <div
            className={`text-center py-12 rounded-lg border-2 border-dashed
            ${
              darkMode
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-gray-50/50"
            }`}
          >
            <UserCircle className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No Users Found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start by adding some users to the system"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
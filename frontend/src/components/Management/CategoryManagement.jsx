import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../api/categoryApi";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Button from "../Button";
import { LoadingSpinner, PageLoader } from "../LoadingSpinner"; 

const CategoryManagement = () => {
  const { darkMode } = useTheme();
  const { data: categories, isLoading, isError, refetch } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  
  const isMutating = isCreating || isUpdating || isDeleting;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        // Update existing category
        await updateCategory({ id: selectedCategory._id, ...formData }).unwrap();
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const result = await createCategory(formData).unwrap();
        console.log('Result:', result); 
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      setSelectedCategory(null);
      refetch();
    } catch (error) {
      console.error('API Error:', error); 
      toast.error(
        error.data?.message || 
        `Error (${error.status || 'unknown'}): ${error.message || 'Something went wrong'}`
      );
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete category");
    }
  };

  // Show full page loader when mutating (creating, updating, deleting)
  if (isMutating) {
    return <PageLoader />;
  }

  // Show loading state for initial data fetch
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
        <p className="ml-4">Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error loading categories</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-6 text-center">
            Category Management
          </h1>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory(null);
              setFormData({ name: "", description: "" });
              setIsModalOpen(true);
            }}
          >
            Add New Category
          </Button>
        </div>

        {/* Categories Table */}
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
                {["Name", "Description", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No categories found. Create one to get started.
                  </td>
                </tr>
              ) : (
                categories?.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Category Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedCategory ? "Edit Category" : "Add New Category"}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="small" className="mr-2" />
                    {selectedCategory ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  selectedCategory ? "Update" : "Create"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryManagement;
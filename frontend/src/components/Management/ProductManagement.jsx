import React, { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import {
  useFetchAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../api/productApi";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";
import { LoadingSpinner, PageLoader } from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Added search state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const { data: products, isLoading, refetch, isFetching } = useFetchAllProductsQuery({
    page,
    limit: 10,
  });

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);

    if (formData.images.length > 0) {
      Array.from(formData.images).forEach((file) => {
        formDataToSend.append("images", file);
      });
    }
    try {
      if (selectedProduct) {
        await updateProduct({
          productId: selectedProduct._id,
          productData: formDataToSend,
        }).unwrap();
        toast.success("Product updated successfully");
      }
      setIsFormModalOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error during product update:", error);
      toast.error(error.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: [],
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "An error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      images: [],
    });
    setSelectedProduct(null);
  };

  // Filter products based on search query
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || isFetching) {
    return <PageLoader />;
  }

  return (
    <div
      className={`space-y-6 p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => navigate("/admin/dashboard/products/create")}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          icon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div
        className={`rounded-lg shadow overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Product</th>
                  <th className="text-left p-4 text-sm font-medium">Description</th>
                  <th className="text-left p-4 text-sm font-medium">Price</th>
                  <th className="text-left p-4 text-sm font-medium">Category</th>
                  <th className="text-left p-4 text-sm font-medium">Stock</th>
                  <th className="text-left p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts?.map((product) => (
                  <tr
                    key={product._id}
                    className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]?.url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 truncate max-w-xs text-gray-500">
                      {product.description}
                    </td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" className="p-2" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="p-2"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <Button variant="secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="secondary" onClick={() => setPage(page + 1)} disabled={!products || products.length < 10}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;

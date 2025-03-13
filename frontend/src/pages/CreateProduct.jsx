import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaFileUpload, FaTag, FaListAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";
import productImage from "../assets/create-product.jpg";
import { useCreateProductMutation } from "../api/productApi";
import { useGetAllCategoriesQuery } from "../api/categoryApi";
import { LoadingSpinner, PageLoader } from "../components/LoadingSpinner"; 

const CreateProduct = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useGetAllCategoriesQuery();

  // Use the createProduct mutation hook
  const [createProduct, { isLoading: isCreating, error: createError }] = useCreateProductMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, images: Array.from(e.target.files) });
    setErrors({ ...errors, images: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.name) newErrors.name = "Required";
    if (!productData.description) newErrors.description = "Required";
    if (!productData.price) newErrors.price = "Required";
    if (!productData.category) newErrors.category = "Required";
    if (!productData.images.length) newErrors.images = "Required";
    if (!productData.stock) newErrors.stock = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Use the createProduct mutation
      await createProduct(productData).unwrap();
      toast.success("Product created successfully!");
      navigate("/products");
    } catch (error) {
      toast.error(error.data?.message || "Error creating product");
    }
  };

  const inputClass = `px-4 py-2 text-lg border rounded focus:outline-none focus:ring-1 w-full ${
    darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"
  }`;

  // Show PageLoader if categories are still loading
  if (categoriesLoading) {
    return <PageLoader />;
  }

  // Show error message if categories fail to load
  if (categoriesError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Failed to load categories. Please try again.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div
        className={`min-h-screen p-4 ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 to-emerald-950"
            : "bg-gradient-to-br from-emerald-50 to-teal-50"
        }`}
      >
        <div
          className={`max-w-5xl mx-auto p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-full lg:w-3/5">
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Create New Product
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 sm:grid-cols-1 gap-6 w-full"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <FaPencilAlt className="inline w-4 h-4 mr-2" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <FaTag className="inline w-4 h-4 mr-2" />
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <FaListAlt className="inline w-4 h-4 mr-2" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <FaTag className="inline w-4 h-4 mr-2" />
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    <FaListAlt className="inline w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    rows="4"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    <FaFileUpload className="inline w-4 h-4 mr-2" />
                    Images
                  </label>
                  <input
                    type="file"
                    name="images"
                    onChange={handleImageChange}
                    className={`${inputClass} text-sm pt-2`}
                    multiple
                  />
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className={`col-span-2 py-3 px-6 rounded-lg font-semibold text-lg text-white ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } transition-colors ${isCreating ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="small" />
                      Creating...
                    </div>
                  ) : (
                    "Create Product"
                  )}
                </button>
                {createError && (
                  <p className="col-span-2 text-red-500 text-sm mt-1">
                    {createError.data?.message || "Error creating product"}
                  </p>
                )}
              </form>
            </div>

            <div className="w-full lg:w-2/5 mt-6 lg:mt-30">
              <img
                src={productImage}
                alt="Product"
                className="w-full sm:w-[400px] h-auto sm:h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;

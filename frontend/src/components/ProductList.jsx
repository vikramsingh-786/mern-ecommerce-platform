import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Search, SlidersHorizontal } from "lucide-react";
import { useFetchAllProductsQuery } from "../api/productApi";
import { useGetAllCategoriesQuery } from "../api/categoryApi"; 
import ProductCard from "./ProductCard";

const ProductList = ({ showHeader = true, limit = 10 }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch products from RTK Query
  const { data: productsData, error: productsError, isLoading: productsLoading } = useFetchAllProductsQuery({
    page: 1,
    limit,
  });

  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = useGetAllCategoriesQuery();

  const products = productsData || [];

  const categories = categoriesData ? ["All", ...categoriesData.map((category) => category.name)] : ["All"];

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={`container mx-auto px-4 py-8 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
          : "bg-white hover:shadow-xl"
      }`}
    >
      {/* Header Section */}
      {showHeader && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Products</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Discover our collection of premium sports equipment and accessories
          </p>
        </div>
      )}

      {/* Search and Filter Section */}
      {showHeader && (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Category Filter */}
          <div
            className={`flex items-center gap-2 overflow-x-auto p-1 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
            {categoriesLoading ? (
              <p>Loading categories...</p>
            ) : categoriesError ? (
              <p>Error loading categories</p>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? darkMode
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500 text-white"
                      : darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Loading/Error States */}
      {productsLoading && (
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">Loading products...</p>
        </div>
      )}
      {productsError && (
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">Error: {productsError.message}</p>
        </div>
      )}

      {/* Products Grid */}
      {!productsLoading && !productsError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Try adjusting your search or filter to find what you're looking for
              </p>
            </div>
          )}
        </div>
      )}

      {/* View All Products Button */}
      {limit && (
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/products")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
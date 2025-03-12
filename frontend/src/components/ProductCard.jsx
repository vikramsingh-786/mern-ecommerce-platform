import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { useAddToCartMutation } from "../api/cartApi";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext"; // Import useCart

const ProductCard = ({ product }) => {
  const { darkMode } = useTheme();
  const [addToCartApi] = useAddToCartMutation();
  const { updateCartCount } = useCart(); 

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error("Product is out of stock!");
      return;
    }
    try {
      await addToCartApi({ productId: product._id, quantity: 1 }).unwrap();
      updateCartCount((prevCount) => prevCount + 1);
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    console.log(`Added ${product.name} to wishlist!`);
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className={`group block h-full rounded-xl transition-all duration-300 ${
        darkMode
          ? "bg-gray-800/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-emerald-600/20"
          : "bg-white hover:shadow-2xl hover:shadow-emerald-100"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`rounded-full p-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ${
                product.stock <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-white text-gray-900 hover:bg-emerald-400 hover:text-white"
                  : "bg-white text-gray-900 hover:bg-emerald-500 hover:text-white"
              }`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
            <button
              onClick={handleAddToWishlist}
              className={`rounded-full p-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 ${
                darkMode
                  ? "bg-white text-gray-900 hover:bg-rose-400 hover:text-white"
                  : "bg-white text-gray-900 hover:bg-rose-500 hover:text-white"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              className={`rounded-full p-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-100 ${
                darkMode
                  ? "bg-white text-gray-900 hover:bg-blue-400 hover:text-white"
                  : "bg-white text-gray-900 hover:bg-blue-500 hover:text-white"
              }`}
              aria-label="View details"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-current text-yellow-400" />
          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            4.5 (128 reviews)
          </span>
        </div>
        <h3 className={`text-lg font-semibold leading-tight mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
          {product.name}
        </h3>
        <p className={`text-sm mb-4 line-clamp-2 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs uppercase ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Price
            </p>
            <p className={`text-xl font-bold ${
              darkMode ? "text-emerald-400" : "text-emerald-600"
            }`}>
              ${product.price}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              product.stock <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : darkMode
                ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white"
            }`}
          >
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
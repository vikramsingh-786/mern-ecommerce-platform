import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUserPlus,
  FaHome,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts/ThemeContext";
import { useCart } from "../../contexts/CartContext";
import logo from "../../assets/logo.avif";
import { useLogoutMutation, useGetCurrentUserQuery } from "../../api/authApi";

const NavLink = ({ to, icon: Icon, children, isActive, onClick, darkMode }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1 ${
      isActive(to)
        ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
        : darkMode
        ? "text-white hover:text-blue-500"
        : "text-gray-800 hover:text-blue-500"
    }`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{children}</span>
  </Link>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { cartCount, clearCartState } = useCart();
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery(
    undefined,
    {
      skip: !localStorage.getItem("token"),
    }
  );

  const isAuthenticated = !!user;

  const userAvatar = user?.avatar?.secure_url || "/default-avatar.jpg";

  const isActive = (path) => location.pathname === path;

  // Logout mutation
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      clearCartState(); // Clear cart state immediately
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.info("Logout Successfully");
      navigate("/login");
      setIsMenuOpen(false);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const navLinks = [
    {
      to: "/",
      icon: FaHome,
      text: "Home",
      showWhen: "always",
    },
    {
      to: "/products",
      icon: FaShoppingCart,
      text: "Products",
      showWhen: "always",
    },
    {
      to: "/profile",
      icon: FaUser,
      text: "Profile",
      showWhen: "always",
    },
    {
      to: "/user/dashboard",
      icon: FaUser,
      text: "User Dashboard",
      showWhen: "user",
    },
    {
      to: "/admin/dashboard",
      icon: FaUserPlus,
      text: "Admin Dashboard",
      showWhen: "admin",
    },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center h-[65px] md:h-[72px] px-4 md:px-8 transition-all duration-300 ease-in-out shadow-md backdrop-blur-sm ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
          : "bg-gray-200 text-gray-800"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`hover:text-blue-500 focus:outline-none transition-colors duration-300 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto md:h-10 transition-all duration-300"
            />
          </Link>
          <Link
            to="/"
            className={`font-bold text-xl ${
              darkMode ? "text-white" : "text-gray-800"
            } shop-now-text`}
          >
            ShopNow
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-800 dark:border-white"
              >
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </Link>
              <button onClick={handleLogout}>
                <FaSignOutAlt
                  className={`h-6 w-6 cursor-pointer ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                />
              </button>
            </>
          ) : (
            <Link to="/login">
              <FaUser
                className={`h-6 w-6 cursor-pointer ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              />
            </Link>
          )}
          {isAuthenticated && cartCount > 0 && (
            <Link to="/cart" className="relative">
              <FaShoppingCart
                className={`h-6 w-6 cursor-pointer ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {cartCount}
              </span>
            </Link>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 transition-colors duration-300 rounded-full focus:outline-none"
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? (
              <FaSun size={20} className="text-yellow-400" />
            ) : (
              <FaMoon size={20} className="text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-[65px] md:top-[72px] left-0 h-[calc(100vh-65px)] md:h-[calc(100vh-72px)] w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
            : "bg-gray-200 text-gray-800"
        } backdrop-blur-md shadow-lg`}
      >
        {/* Navigation Links */}
        <div className="flex flex-col space-y-8 p-10">
          {navLinks.map((link) => {
            const shouldShow =
              link.showWhen === "always" ||
              (link.showWhen === "user" &&
                isAuthenticated &&
                user?.role === "user") ||
              (link.showWhen === "admin" && user?.role === "admin");

            return shouldShow ? (
              <NavLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                isActive={isActive}
                darkMode={darkMode}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </NavLink>
            ) : null;
          })}
          {user?.role === "admin" && (
            <NavLink
              to="/admin/dashboard/products/create"
              icon={FaUserPlus}
              isActive={isActive}
              darkMode={darkMode}
              onClick={() => setIsMenuOpen(false)}
            >
              Create Product
            </NavLink>
          )}
        </div>

        {/* Auth Section */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 pb-8 md:pb-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } ${
            darkMode
              ? "bg-gradient-to-br from-slate-950 to-emerald-950"
              : "bg-gray-200"
          } backdrop-blur-md`}
        >
          <div className="space-y-2 mb-10 md:mb-0">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300"
              >
                <FaSignOutAlt size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus size={20} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

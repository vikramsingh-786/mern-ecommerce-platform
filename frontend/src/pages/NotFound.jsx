import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import notFoundImg from "../assets/404.jpg";
import { useTheme } from "../contexts/ThemeContext";

const NotFound = () => {
  const { darkMode } = useTheme();

  return (
    <Layout>
      <div
        className={`flex flex-col md:flex-row items-center justify-center min-h-screen px-6 py-16 ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
            : "bg-gradient-to-br from-emerald-50 to-teal-50"
        }`}
      >
        {/* Left Content */}
        <div className="md:w-1/2 mb-8 md:mb-0 md:pl-50 text-center md:text-left">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-2xl mb-4">Oops! Page not found.</p>
          <p className="text-lg mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Go Back Home
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={notFoundImg}
            alt="Page Not Found"
            className="rounded-lg shadow-xl max-w-[70%] mx-auto"
          />
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

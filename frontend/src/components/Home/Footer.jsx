import React, { useState } from "react";
import { AiFillPhone, AiOutlineMail } from "react-icons/ai";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";
import { useContactUsMutation } from "../../api/authApi";

const Footer = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [contactUs, { isLoading }] = useContactUsMutation();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await contactUs({ email, message }).unwrap();
      setSuccessMessage("Thank you! Your message has been sent.");
      setEmail("");
      setMessage("");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer
      className={`pt-12 pb-4 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
          : "bg-gradient-to-br from-emerald-50 to-teal-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Contact Information
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <AiFillPhone className="text-blue-400" size={20} />
                <span className="ml-2">+1 123 456 789</span>
              </div>
              <div className="flex items-center">
                <AiOutlineMail className="text-blue-400" size={20} />
                <span className="ml-2">info@example.com</span>
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <Link to="#" className="hover:text-blue-400 transition-colors">
                <FaFacebookF size={20} />
              </Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Quick Links
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`hover:text-blue-400 transition-colors ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className={`hover:text-blue-400 transition-colors ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className={`hover:text-blue-400 transition-colors ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`hover:text-blue-400 transition-colors ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Contact Us
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 text-gray-300 border-gray-700 focus:ring-2 focus:ring-blue-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500"
                } focus:outline-none`}
                required
              />
              <textarea
                rows="4"
                name="message"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 text-gray-300 border-gray-700 focus:ring-2 focus:ring-blue-500"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500"
                } focus:outline-none`}
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
              {successMessage && <p className="text-green-500">{successMessage}</p>}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </form>
          </div>
        </div>

        <div className={`border-t border-gray-800 pt-8 text-center ${darkMode ? "text-gray-400" : "text-gray-800"}`}>
          &copy; {new Date().getFullYear()} Coffee Ecommerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

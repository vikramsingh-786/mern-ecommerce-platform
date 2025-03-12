import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateAvatar,
} from "../utils/validation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerImage from "../assets/register.jpg";
import { useRegisterMutation } from "../api/authApi"; 
import { LoadingSpinner, PageLoader } from "../components/LoadingSpinner"; 

const Register = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [errors, setErrors] = useState({});

  // RTK Query register mutation
  const [register, { isLoading, error }] = useRegisterMutation();

  // Handle registration success and error
  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || "Registration failed. Please try again.");
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = {};
    if (!validateName(formData.name))
      validationErrors.name = "Name is required.";
    if (!validateEmail(formData.email))
      validationErrors.email = "Invalid email address.";
    if (!validatePassword(formData.password))
      validationErrors.password =
        "Password must be at least 6 characters long and include a number and uppercase letter.";
    if (formData.avatar && !validateAvatar(formData.avatar))
      validationErrors.avatar =
        "Avatar must be an image (JPEG, PNG, GIF) and less than 5MB.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    try {
      const response = await register(formDataToSend).unwrap();
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login page
    } catch (err) {
      setErrors({
        register: err.data?.message || "Registration failed. Please try again.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, avatar: file }));
    setErrors((prev) => ({ ...prev, avatar: "" })); // Clear error on change
  };

  return (
    <Layout>
      {isLoading && <PageLoader />} {/* Show PageLoader when isLoading is true */}
      <div
        className={`min-h-[80vh] flex flex-col lg:flex-row justify-center items-center sm:px-6 lg:px-8 ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
            : "bg-gradient-to-br from-emerald-50 to-teal-50"
        }`}
      >
        {/* Registration Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className={`font-medium ${
                  darkMode
                    ? "text-blue-600 hover:text-blue-500"
                    : "text-blue-600 hover:text-blue-500"
                }`}
              >
                Sign in
              </Link>
            </p>

            <div
              className={`mt-8 py-8 px-4 shadow sm:rounded-lg sm:px-10 ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-600 border-gray-500 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Avatar Field */}
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium">
                    Profile Picture
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="avatar"
                      className={`cursor-pointer flex items-center justify-center w-full px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                        darkMode
                          ? "bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500"
                          : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Upload className="h-5 w-5 mr-2 text-gray-400" /> Upload
                      Avatar
                    </label>
                    {formData.avatar && (
                      <span className="ml-2 text-sm text-gray-400">
                        {formData.avatar.name}
                      </span>
                    )}
                  </div>
                  {errors.avatar && (
                    <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="terms"
                    className={`ml-2 block text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className={`font-medium ${
                        darkMode
                          ? "text-blue-600 hover:text-blue-500"
                          : "text-blue-600 hover:text-blue-500"
                      }`}
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className={`font-medium ${
                        darkMode
                          ? "text-blue-600 hover:text-blue-500"
                          : "text-blue-600 hover:text-blue-500"
                      }`}
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Registration Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-8 pt-40">
          <img
            src={registerImage}
            alt="Register"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
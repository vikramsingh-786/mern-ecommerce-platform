import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/validation";
import { toast } from "react-toastify";
import loginImage from "../assets/login.jpg";
import { useLoginMutation } from "../api/authApi"; // Import RTK Query hook
import { LoadingSpinner, PageLoader } from "../components/LoadingSpinner"; // Import LoadingSpinner and PageLoader

const Login = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // RTK Query login mutation
  const [login, { isLoading, error }] = useLoginMutation();

  // Handle login success
  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || "Login failed. Please try again.");
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = {};
    if (!validateEmail(formData.email))
      validationErrors.email = "Invalid email address.";
    if (!formData.password) validationErrors.password = "Password is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await login(formData).unwrap(); // Call the login mutation
      toast.success("Login successful!");
      navigate("/"); // Redirect to home page
    } catch (err) {
      setErrors({
        login: err.data?.message || "Login failed. Please try again.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  return (
    <Layout>
      {isLoading && <PageLoader />} {/* Show PageLoader when isLoading is true */}
      <div
        className={`min-h-[90vh] flex flex-col lg:flex-row justify-center items-center sm:px-6 lg:px-8 ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
            : "bg-gradient-to-br from-emerald-50 to-teal-50"
        }`}
      >
        {/* Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className={`font-medium ${
                  darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-500"
                }`}
              >
                Signup
              </Link>
            </p>

            <div
              className={`mt-8 py-8 px-4 shadow sm:rounded-lg sm:px-10 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300 text-gray-900"
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
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
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300 text-gray-900"
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          className={`h-5 w-5 ${
                            darkMode ? "text-gray-300" : "text-gray-400"
                          }`}
                        />
                      ) : (
                        <Eye
                          className={`h-5 w-5 ${
                            darkMode ? "text-gray-300" : "text-gray-400"
                          }`}
                        />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className={`text-blue-600 hover:text-blue-500 ${
                        darkMode ? "text-blue-400 hover:text-blue-300" : ""
                      }`}
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="small" className="mr-2" />
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>

                {/* Display error */}
                {error && (
                  <p className="text-sm text-red-500 text-center mt-2">
                    {error.data?.message || "Login failed. Please try again."}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Login Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-8 pt-25">
          <img
            src={loginImage}
            alt="Login"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
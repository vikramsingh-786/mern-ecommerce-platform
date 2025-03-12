import React, { useState, useEffect } from "react";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "../api/authApi";
import { useForm } from "react-hook-form";
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  KeyIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../contexts/ThemeContext";
import Layout from "../components/Layout";

const Profile = () => {
  const { darkMode } = useTheme();
  const { data: user, isLoading, isError, refetch } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role);
      setAvatarPreview(user.avatar?.secure_url || "");
    }
  }, [user, setValue]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const onSubmitProfile = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await updateProfile(formData);
      
      if ('error' in response) {
        throw new Error(response.error.message || 'Update failed');
      }

      await refetch();
      setIsEditing(false);
      setAvatarFile(null); 
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await updatePassword(data);
      setShowPasswordForm(false);
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  if (isLoading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (isError)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        <div
          className={`text-center p-6 ${
            darkMode ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-600"
          } rounded-xl backdrop-blur-sm shadow-lg`}
        >
          <XMarkIcon className="h-12 w-12 mx-auto mb-2" />
          Error loading profile
        </div>
      </div>
    );

  return (
    <Layout>
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
        } py-8 px-4 transition-colors duration-200`}
      >
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <div
            className={`${
              darkMode ? "bg-gray-800/90" : "bg-white/90"
            } rounded-2xl shadow-lg backdrop-blur-sm p-8 transform hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-200 group-hover:ring-indigo-300 transition-all duration-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-indigo-200 group-hover:ring-indigo-300">
                    {getInitials(user?.name)}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-3 cursor-pointer hover:bg-indigo-700 transform hover:scale-110 transition-all duration-200 ring-2 ring-white">
                    <CameraIcon className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      {...register("avatar")}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <div>
                <h1
                  className={`text-4xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  {user?.name}
                </h1>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } text-lg`}
                >
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div
            className={`${
              darkMode ? "bg-gray-800/90" : "bg-white/90"
            } rounded-2xl shadow-lg backdrop-blur-sm p-8 transform hover:scale-[1.02] transition-all duration-300`}
          >
            <form
              onSubmit={handleSubmit(onSubmitProfile)}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    className={`flex items-center text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <UserCircleIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    disabled={!isEditing}
                    className={`w-full rounded-lg p-3 ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                        : "border-gray-300 bg-gray-50 focus:border-indigo-500"
                    } transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-75`}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`flex items-center text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    disabled={!isEditing}
                    className={`w-full rounded-lg p-3 ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                        : "border-gray-300 bg-gray-50 focus:border-indigo-500"
                    } transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-75`}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`flex items-center text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Role
                  </label>
                  <input
                    type="text"
                    {...register("role")}
                    disabled
                    className={`w-full rounded-lg p-3 ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 border-gray-600"
                        : "border-gray-300 bg-gray-100 text-gray-600"
                    } transform hover:scale-[1.02] transition-all duration-200`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium ${
                      darkMode
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } transform hover:scale-105 transition-all duration-200`}
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transform hover:scale-105 transition-all duration-200`}
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProfile || !isDirty}
                      className="flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                    >
                      {isUpdatingProfile ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CheckIcon className="h-5 w-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div
            className={`${
              darkMode ? "bg-gray-800/90" : "bg-white/90"
            } rounded-2xl shadow-lg backdrop-blur-sm p-8 transform hover:scale-[1.02] transition-all duration-300`}
          >
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className={`flex items-center ${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              } transform hover:scale-105 transition-all duration-200`}
            >
              <KeyIcon className="h-6 w-6 mr-2 text-indigo-500" />
              <span className="text-xl font-medium">Change Password</span>
            </button>

            {showPasswordForm && (
              <form
                onSubmit={handleSubmit(onSubmitPassword)}
                className="mt-8 space-y-6"
              >
                {["currentPassword", "newPassword", "confirmPassword"].map(
                  (field) => (
                    <div key={field} className="space-y-2">
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type="password"
                        {...register(field, { required: true })}
                        className={`w-full rounded-lg p-3 ${
                          darkMode
                            ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                            : "border-gray-300 bg-gray-50 focus:border-indigo-500"
                        } transform hover:scale-[1.02] transition-all duration-200`}
                      />
                    </div>
                  )
                )}

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transform hover:scale-105 transition-all duration-200`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                  >
                    {isUpdatingPassword ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

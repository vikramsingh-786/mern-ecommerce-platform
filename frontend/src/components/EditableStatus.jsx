import React, { useState } from "react";

const EditableStatus = ({ status, onStatusChange, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const getStatusColor = () => {
    switch (currentStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    onStatusChange(newStatus); // Notify parent component of the change
    setIsEditing(false); // Exit editing mode
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <select
          value={currentStatus}
          onChange={handleStatusChange}
          className={`px-3 py-1 rounded-lg border text-sm ${getStatusColor()} focus:outline-none ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          }`}
          autoFocus
          onBlur={() => setIsEditing(false)}
        >
          {["pending", "processing", "shipped", "delivered", "cancelled"].map(
            (status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            )
          )}
        </select>
      ) : (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${getStatusColor()}`}
          onClick={() => setIsEditing(true)}
        >
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </span>
      )}
    </div>
  );
};

export default EditableStatus;

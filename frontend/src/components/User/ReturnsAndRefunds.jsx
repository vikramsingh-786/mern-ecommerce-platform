import React from "react";
import Card from "../Card";
import Button from "../Button";

const ReturnsAndRefunds = () => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Returns & Refunds
        </h3>

        {/* Request for Returns/Refunds Section */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Request for Returns/Refunds
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you are not satisfied with your purchase, you can request a return
            or refund within 30 days of delivery.
          </p>
          <Button variant="primary" className="w-full sm:w-auto">
            Request Return/Refund
          </Button>
        </div>

        {/* Track Refund Status Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Track Refund Status
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enter your return ID to track the status of your refund.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Return ID"
              className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button variant="primary" className="w-full sm:w-auto">
              Track Status
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReturnsAndRefunds;
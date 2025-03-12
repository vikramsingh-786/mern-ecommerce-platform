import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const SpecialOffer = ({ imgSrc, offerCode, validUntil }) => {
  const { darkMode } = useTheme();

  return (
    <section
      className={`py-12 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 to-emerald-950"
          : "bg-blue-50"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Section: Offer Details */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Special Offer</h2>
            <p
              className={`text-lg mb-6 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Get 20% off on your first purchase. Use code:{" "}
              <span className="font-semibold text-blue-600">{offerCode}</span>
            </p>
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">
                20% OFF
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Valid until{" "}
                <span className="font-semibold">{validUntil}</span>
              </div>
            </div>
          </div>

          {/* Right Section: Offer Image */}
          <div className="md:w-1/2 md:ml-8">
            <img
              src={imgSrc}
              alt="Special Offer"
              className="rounded-lg shadow-xl max-w-[80%] mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
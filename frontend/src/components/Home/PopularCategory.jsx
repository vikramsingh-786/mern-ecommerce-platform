import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import img2 from "../../assets/category.jpg";

const PopularCategory = () => {
  const { darkMode } = useTheme();

  const categories = [
    {
      title: "Sports Apparel & Gear",
    },
    {
      title: "Fitness Equipment",
    },
    {
      title: "Outdoor Sports & Recreation",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between">
        {/* Right Content */}
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h2 className="text-3xl font-bold mb-4">Shop by Sports Category</h2>
          <p
            className={`text-lg mb-6 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Explore our wide range of sports-related categories and find exactly
            what you're looking for.
          </p>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                } hover:bg-blue-100 transition duration-300 cursor-pointer ${
                  darkMode ? "hover:text-gray-900" : "hover:text-gray-900"
                }`}
              >
                <h3 className="font-semibold">{category.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Left Image */}
        <div className="md:w-1/2">
          <img
            src={img2}
            alt="Categories"
            className="rounded-lg shadow-xl max-w-[80%] mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default PopularCategory;

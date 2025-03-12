import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Truck, ShoppingBag, Clock, Shield } from "lucide-react"; 

const FeaturesSection = () => {
  const { darkMode } = useTheme();

  const features = [
    {
      icon: <Truck className="w-12 h-12 text-blue-600" />,
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-blue-600" />,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-600" />,
      title: "24/7 Support",
      description: "Always here to help",
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Secure Payment",
      description: "100% secure checkout",
    },
  ];

  return (
    <section
      className={`py-16 ${darkMode ? "bg-gradient-to-br from-slate-950 to-emerald-950" : "bg-white text-gray-800"}`}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 p-6 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } shadow-md transition-all duration-300`}
            >
              {feature.icon}
              <div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

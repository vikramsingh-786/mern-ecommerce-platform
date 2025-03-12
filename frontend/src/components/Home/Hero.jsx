import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import heroImg from "../../assets/Hero.jpg";

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
  }),
};

const Hero = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`w-full flex items-center justify-center ${
      darkMode ? "bg-gradient-to-br from-slate-950 to-emerald-950" : "bg-gradient-to-br from-emerald-50 to-teal-50"
    }`}>
      <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
        >
          <motion.h1
            custom={0}
            variants={textVariants}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Elevate Your Game with{" "}
            <span className="text-blue-600">SportVilla</span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={textVariants}
            className={`text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover top-quality sports gear and apparel designed for champions.
            Shop now and take your performance to the next level.
          </motion.p>

          <motion.div
            custom={2}
            variants={textVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
              Shop Now
            </button>
            <button
              className={`px-8 py-4 font-semibold rounded-lg transition-colors duration-300 transform hover:scale-105 ${
                darkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-white text-blue-600 hover:bg-gray-100"
              }`}
            >
              View Collections
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex justify-center"
        >
          <div className="relative w-full max-w-md">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 -left-4 w-48 h-48 bg-emerald-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

            {/* Main image */}
            <div className="relative">
              <img
                src={heroImg}
                alt="SportVilla Hero"
                className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className={`absolute -bottom-6 -right-6 p-4 rounded-lg shadow-lg ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <p className="text-sm font-semibold">Trusted by</p>
                <p className="text-2xl font-bold text-blue-600">2M+ Athletes</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

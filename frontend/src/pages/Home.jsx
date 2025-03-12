import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import ProductList from "../components/ProductList";
import Hero from "../components/Home/Hero";
import Testimonials from "../components/Home/Testimonials";
import PopularCategory from "../components/Home/PopularCategory";
import FeaturesSection from "../components/Home/FeaturesSection";
import SpecialOffer from "../components/Home/SpecialOffer";
import img3 from "../assets/special.jpg";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
        >
          <Hero />
        </motion.div>

        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
          className={`text-3xl font-bold text-center mb-8 py-5 ${
            darkMode
              ? "bg-gradient-to-br from-slate-950 to-emerald-950 text-white"
              : "text-gray-900"
          }`}
        >
          Our Products
        </motion.h1>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
        >
          <ProductList showHeader={false} limit={4} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
        >
          <FeaturesSection />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
        >
          <PopularCategory />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
        >
          <Testimonials />
        </motion.div>

        {/* Special Offer Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionVariants}
        >
          <SpecialOffer imgSrc={img3} offerCode="WELCOME20" validUntil="December 31, 2024" />
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Home;

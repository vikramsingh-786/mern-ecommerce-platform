import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const Layout = ({ children, hideNav, hideFooter }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 to-emerald-950"
          : "bg-gradient-to-br from-emerald-50 to-teal-50"
      }`}
    >
      {!hideNav && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../css/NavBar.css"; // Ensure your styles are in place

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* 🟢 Toggle Button */}
      <button className="toggle-button" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* 🟢 Sidebar Menu */}
      <motion.div
        className="sidebar"
        initial={{ left: "-100%" }}
        animate={{ left: menuOpen ? "0" : "-100%" }}
        transition={{ duration: 0.5 }}
      >
        {/* 🟢 Close Button */}
        <button className="close-button" onClick={() => setMenuOpen(false)}>
          ✖
        </button>

        {/* 🟢 Navigation Links */}
        <nav className="nav-links">
         
          <Link to="" className="nav-item" onClick={() => setMenuOpen(false)}>Colloborative Coding</Link> 
          <Link to="/login" className="nav-item" onClick={() => setMenuOpen(false)}>1V1</Link>  
          <Link to="" className="nav-item" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
          <Link to="" className="nav-item" onClick={() => setMenuOpen(false)}>
          Contact Us
          </Link>
        </nav>
      </motion.div>

      {/* 🟢 Backdrop when menu is open */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default NavBar;
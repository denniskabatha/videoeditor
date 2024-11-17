import React from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUser, FaHome, FaSun, FaMoon } from "react-icons/fa";

const Navbar = ({ toggleTheme, isDarkTheme }) => {
  return (
    <nav className="navbar">
      <div className="logo">📚 Librarium</div>
      <div className="links">
        <Link to="/" className="nav-link">
          <FaHome /> Home
        </Link>
        <Link to="/admin" className="nav-link">
          <FaBook /> Admin
        </Link>
        <Link to="/history" className="nav-link">
          <FaUser /> Borrowing History
        </Link>
      </div>
      <button className="theme-toggle-button" onClick={toggleTheme}>
        {isDarkTheme ? <FaSun /> : <FaMoon />}
      </button>
    </nav>
  );
};

export default Navbar;

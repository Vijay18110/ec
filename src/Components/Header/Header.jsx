import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";

import "./Header.css";
import UserMenu from "./UserManu";
import NavLinks from "./NavLinks";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) navigate(`/search?q=${query}`);
  };

  return (
    <header className="header shadow-sm bg-white sticky-top mb-1">
      <div className="container d-flex align-items-center justify-content-between py-2">
        {/* Logo */}
        <Link to="/home" className="navbar-brand fw-bold text-primary fs-4">
          ShopEase<span className="text-dark">.</span>
        </Link>

        {/* Search Bar */}
        <form className="d-none d-md-flex flex-grow-1 mx-4" onSubmit={handleSearch}>
          <input
            name="search"
            type="text"
            placeholder="Search for products..."
            className="form-control rounded-pill px-3"
          />
        </form>

        {/* Icons */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/wishlist" className="icon-btn position-relative">
            <FaHeart size={20} />
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">3</span>
          </Link>

          <Link to="/cart" className="icon-btn position-relative">
            <FaShoppingCart size={20} />
            <span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill">2</span>
          </Link>

          <div className="position-relative">
            <FaUserCircle size={24} className="icon-btn" onClick={toggleUserMenu} />
            <AnimatePresence>{showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}</AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="d-md-none">
            <button className="btn btn-light border-0" onClick={toggleMenu}>
              {showMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      {/* <AnimatePresence>
        {(showMenu || window.innerWidth >= 768) && (
          <motion.nav
            className={`nav-links bg-white border-top d-md-flex justify-content-center ${showMenu ? "d-block" : "d-none d-md-flex"
              }`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NavLinks onLinkClick={() => setShowMenu(false)} />
          </motion.nav>
        )}
      </AnimatePresence> */}
    </header>
  );
};

export default Header;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./navbar.css"; // Import custom styles
import Logo from "../../voting-app-logo.png";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { isLoggedIn, logout } = useUser(); // Use isLoggedIn and logout from context

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/" className="navbar-brand">
          <img src={Logo} alt="Logo" className="nav__logo-img" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={showMenu}
          aria-label="Toggle navigation"
        >
          <IoMenu />
        </button>
        <div className={`collapse navbar-collapse ${showMenu ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink
                to="/candidates"
                className="nav-link"
                onClick={closeMenuOnMobile}
                activeClassName="active"
              >
                Candidates
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/votecount"
                className="nav-link"
                onClick={closeMenuOnMobile}
                activeClassName="active"
              >
                Vote Count
              </NavLink>
            </li>
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className="nav-link"
                    onClick={closeMenuOnMobile}
                    activeClassName="active"
                  >
                    Log In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/signup"
                    className="nav-link"
                    onClick={closeMenuOnMobile}
                    activeClassName="active"
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/profile"
                    className="nav-link"
                    onClick={closeMenuOnMobile}
                    activeClassName="active"
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className="nav-link"
                    onClick={logout}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

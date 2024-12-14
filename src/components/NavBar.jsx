import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMoon, faSun, faDollarSign, faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import '../styles/NavBar.css';



const NavBar = () => {
  const { user, logout, toggleTheme, toggleCurrency, theme, currency } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page
    setMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Coin Chest</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/"><FontAwesomeIcon icon={faHouse} /></Link></li>
        <li><Link to="/service">Service</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {!user ? (
          <li><Link to="/login">Login</Link></li>
        ) : (
          <div className="profile-menu" ref={menuRef}>
            <img
              src={user.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              className="profile-photo"
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            {menuOpen && (
              <div className="profile-dropdown">
                {/* First Group */}
                <div className="dropdown-group">
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/portfolio" onClick={() => setMenuOpen(false)}>Portfolio</Link>
                  <Link to="/alerts" onClick={() => setMenuOpen(false)}>Alerts</Link>
                </div>
                <hr />
                {/* Second Group: Settings */}
                <div className="dropdown-group">
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
                  <div className="dropdown-item settings">
                    Settings
                    <div className="submenu">
                      <div className="submenu-item" onClick={toggleTheme}>
                        <FontAwesomeIcon icon={theme === "light" ? faSun : faMoon} />{" "}
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                      </div>
                      <div className="submenu-item" onClick={toggleCurrency}>
                        <FontAwesomeIcon icon={currency === "USD" ? faDollarSign : faEuroSign} />{" "}
                        {currency === "USD" ? "Switch to Euro" : "Switch to USD"}
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                {/* Third Group */}
                <div className="dropdown-group">
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

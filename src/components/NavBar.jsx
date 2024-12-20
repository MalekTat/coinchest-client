import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faRightToBracket, faMoon, faSun, faDollarSign, faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import '../styles/NavBar.css';



const NavBar = () => {
  const { user, logout, toggleTheme, toggleCurrency, theme, currency } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuTimeout = useRef(null);
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
    setMenuOpen(false); 
  };

  const handleMouseEnterSubmenu = () => {
    clearTimeout(submenuTimeout.current); 
    setSubmenuOpen(true);
  };

  const handleMouseLeaveSubmenu = () => {
    submenuTimeout.current = setTimeout(() => {
      setSubmenuOpen(false); 
    }, 200); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Coin Chest</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/"><FontAwesomeIcon icon={faHouse} /></Link></li>
        <li><Link to="/services">Service</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {!user ? (
          <li><Link to="/login"><FontAwesomeIcon icon={faRightToBracket} size="xl" /></Link></li>
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
                  <div 
                    className="dropdown-item settings"
                    onMouseEnter={handleMouseEnterSubmenu}
                    onMouseLeave={handleMouseLeaveSubmenu}
                  >
                    Settings
                    {submenuOpen && (
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
                    )}
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

import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setMenuOpen(false); // Close menu on route change
  }, [location.pathname]);

  const isMasterAdmin = location.pathname.startsWith("/master-admin");
  const isPublicPage = !location.pathname.startsWith("/admin") && !isMasterAdmin;

  if (isMasterAdmin) return null;

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          The Stone Edge Spa
        </NavLink>
      </div>

      {isPublicPage && (
        <>
          <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          {menuOpen && (
            <div className="nav-overlay active" onClick={toggleMenu}></div>
          )}
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li className="close-btn-container">
              <button className="close-btn" onClick={toggleMenu}>✕</button>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    window.location.href = "/";
                  }
                  toggleMenu();
                }}
              >
                Home
              </a>
            </li>
            <li>
              {location.pathname === "/" ? (
                <a href="#services" onClick={toggleMenu}>Services</a>
              ) : (
                <NavLink to="/#services" onClick={toggleMenu}>Services</NavLink>
              )}
            </li>
            <li>
              {location.pathname === "/" ? (
                <a href="#about" onClick={toggleMenu}>About</a>
              ) : (
                <NavLink to="/#about" onClick={toggleMenu}>About</NavLink>
              )}
            </li>
            <li>
              {location.pathname === "/" ? (
                <a href="#reviews" onClick={toggleMenu}>Reviews</a>
              ) : (
                <NavLink to="/#reviews" onClick={toggleMenu}>Reviews</NavLink>
              )}
            </li>
            <li>
              <NavLink
                to="/membership"
                onClick={toggleMenu}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Membership
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/book"
                onClick={toggleMenu}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Book Now
              </NavLink>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}

export default Navbar;

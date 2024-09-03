import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaHouseDamage,
  FaUsers,
  FaUserPlus,
} from "react-icons/fa";
import "./NavigationBar.css";

function NavigationBar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleSetActive = (path) => {
    setActiveLink(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MyApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeLink === "/" ? "active-link" : ""
                }`}
                to="/"
                onClick={() => handleSetActive("/")}
              >
                <FaHome className="nav-icon" /> First AC
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeLink === "/2" ? "active-link" : ""
                }`}
                to="/2"
                onClick={() => handleSetActive("/2")}
              >
                <FaBuilding className="nav-icon" /> Second AC
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeLink === "/3" ? "active-link" : ""
                }`}
                to="/3"
                onClick={() => handleSetActive("/3")}
              >
                <FaHouseDamage className="nav-icon" /> Non AC
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeLink === "/All" ? "active-link" : ""
                }`}
                to="/All"
                onClick={() => handleSetActive("/All")}
              >
                <FaUsers className="nav-icon" /> Other Members
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeLink === "/allocation" ? "active-link" : ""
                }`}
                to="/allocation"
                onClick={() => handleSetActive("/allocation")}
              >
                <FaUserPlus className="nav-icon" /> Add new member
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;

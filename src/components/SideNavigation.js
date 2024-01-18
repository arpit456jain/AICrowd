// SideNavigation.js

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideNavigation.css";
import { Dropdown } from "react-bootstrap";

const SideNavigation = ({ userEmail, onLogout,totalPoints,FetchPoints }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavigation = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Optionally, you can do something with the userEmail here
    console.log("User Email:", userEmail);
    FetchPoints()
  }, [userEmail,totalPoints]);

  return (
    <aside className={`side-navigation ${isOpen ? "open" : ""}`}>
      <div className="menu-icon" onClick={toggleNavigation}>
        <div className={`icon ${isOpen ? "open" : ""}`} />
      </div>
      <div className="logo">
        <h1>AiCrowd</h1>
      </div>
      <ul className={`menu-items ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/allRecordings">All Recordings</Link>
        </li>
        
        {userEmail ? (
          <>
          <li>
          <Link to="#">Total Points : {totalPoints}</Link>
        </li>
          <li>
            <Dropdown>
              <Dropdown.Toggle
                variant="warning"
                id="dropdown-basic"
                style={{ backgroundColor: "#6028bb", color: "#fff" }}
              >
                {userEmail}
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ backgroundColor: "#6028bb" }}>
                <Dropdown.Item href="#" onClick={onLogout}>
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          </>
        ) : (
          ""
        )}
      </ul>
    </aside>
  );
};

export default SideNavigation;

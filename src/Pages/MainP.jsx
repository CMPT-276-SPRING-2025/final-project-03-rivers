import React, { useState, useEffect } from 'react';
import './MainP.css';
import logout from '../assets/logout.png';
import Soundcloud, { togglePanel } from './Components/Soundcloud';
import { SidebarData } from './SidebarData';
import Chatbot from "./Components/Chatbot"
<<<<<<< HEAD
=======
import { signOut } from "@firebase/auth";
import { auth } from "./Firebase.jsx";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from '@firebase/auth';


>>>>>>> 305bbaab8143bed06a4325848eb466b294b5982e
const Login = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <Soundcloud 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onTogglePanel={togglePanel}
      />
    </>
  );
};

const NavBar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <nav className="navBar">
      <div className="tabs">
        <ul className="focusF">
          <li >FocusForge</li>
        </ul>
        <ul className="themes">
          <li>Themes</li>
        </ul>
        
        <div 
          className="logout-container"
          onClick={handleLogout}  // Add click handler for the entire button
          onMouseEnter={() => setShowDropdown(true)}  // Show dropdown on hover
          onMouseLeave={() => setShowDropdown(false)} // Hide dropdown when mouse leaves
        >
          <button className="logout">
            <img 
              src={logout}
              alt="Logout"
              style={{ width: '35px', height: '35px' }} 
            />
            {/* Optionally, you can display the text on hover */}
            {showDropdown && (
              <span className="logout-text">Logout</span>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
};


const SideBar = ({ isOpen, onTogglePanel }) => {
  return (
    <div className="Sidebar">
      <ul>
        {SidebarData.map((val, index) => (
          <li
            key={val.title}
            onClick={() => {
              if (val.title === 'Music') {
                onTogglePanel(isOpen);
              } else {
                window.location.pathname = val.link;
              }
            }}
            className="sidebar-item"
          >
            <div className="sidebar-icon">{val.icon}</div>
            <div className="sidebar-title">{val.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MainP = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleTogglePanel = (currentIsOpen) => {
    setIsOpen(!currentIsOpen);
  };

  return (
    <div className="mainP">
      <NavBar />
      <Chatbot />
      <SideBar 
        isOpen={isOpen}
        onTogglePanel={handleTogglePanel}
      />
      <Login 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default MainP;
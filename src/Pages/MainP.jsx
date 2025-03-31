import React, { useState } from 'react';
import './MainP.css';
import logout from '../assets/logout.png';
import Soundcloud, { togglePanel } from './Components/Soundcloud';
import { SidebarData } from './SidebarData';
import Chatbot from "./Components/Chatbot"
import StickyNotes from './Components/StickyNotes';

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
  return (
    <nav className="navBar">
      <div className="tabs">
        <ul className="focusF">
          <li>FocusForge</li>
        </ul>
        <ul className="themes">
          <li>Themes</li>
        </ul>
        <button className="logout">
          <img 
            src={logout}
            alt="Logout"
            style={{ width: '35px', height: '35px' }}
          />
        </button>
      </div>
    </nav>
  );
};

const SideBar = ({ isOpen, onTogglePanel, setShowStickyNotes }) => {
  return (
    <div className="Sidebar">
      <ul>
        {SidebarData.map((val, index) => (
          <li
            key={val.title}
            onClick={() => {
              if (val.title === 'Music') {
                onTogglePanel(isOpen);
              } 
              else if (val.action === 'toggleStickyNotes') {
                setShowStickyNotes((prev) => !prev);
              }
              else {
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
  const [showStickyNotes, setShowStickyNotes] = useState(false);
  
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
        setShowStickyNotes ={setShowStickyNotes}
      />
      <Login 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      {showStickyNotes && <StickyNotes />}
    </div>
  );
};

export default MainP;
import React, { useState, useEffect } from 'react';
import './MainP.css';
import logout from '../assets/logout.png';
import Soundcloud, { togglePanel } from './Components/Soundcloud';
import { SidebarData } from './SidebarData';
import Chatbot from "./Components/Chatbot"
import StickyNotes from './Components/StickyNotes';
import TaskManager from './Components/TaskManager';
import { fetchTasks } from './Components/Todo';
import TaskForm from "./Components/TaskForm";
import TaskList from "./Components/TaskList";

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

const SideBar = ({ isOpen, onTogglePanel, setShowStickyNotes, setTaskManager }) => {
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
              else if(val.action === 'toggleTaskManager') {
                setTaskManager((prev) => !prev);
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
  const [showTaskManager, setTaskManager] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const handleTogglePanel = (currentIsOpen) => {
    setIsOpen(!currentIsOpen);
  };

  useEffect(() => {
    const checkTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    checkTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  if (loading) {
    return <p>Getting Tasks... </p>;
  }

  return (
    <div className="mainP">
      <NavBar />
      <Chatbot />
      <SideBar 
        isOpen={isOpen}
        onTogglePanel={handleTogglePanel}
        setShowStickyNotes ={setShowStickyNotes}
        setTaskManager = {setTaskManager}
      />
      <Login 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      {showStickyNotes && <StickyNotes />}
      {showTaskManager && (tasks.length === 0 ? 
        <TaskForm newTaskAdded={handleTaskAdded} /> : 
        <TaskList tasks={tasks} />
      )}
    </div>
  );
};

export default MainP;
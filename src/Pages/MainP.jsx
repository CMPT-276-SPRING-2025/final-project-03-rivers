import React, { useState, useEffect } from 'react';
import './MainP.css';
import logout from '../assets/logout.png';
import Soundcloud, { togglePanel } from './Components/Soundcloud';
import { SidebarData } from './SidebarData';
import Chatbot, { toggleExpand } from "./Components/Chatbot";
import { signOut } from "@firebase/auth";
import { auth } from "./Firebase.jsx";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from '@firebase/auth';
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
                    <li className='focusFtext'>FocusForge</li>
                </ul>
                <ul className="themes">
                    <li>Themes</li>
                </ul>
                <div
                    className="logout-container"
                    onClick={handleLogout}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <button className="logout">
                        <img
                            src={logout}
                            alt="Logout"
                            style={{ width: '35px', height: '35px' }}
                        />
                        {showDropdown && (
                            <span className="logout-text">Logout</span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

const SideBar = ({ isOpen, onTogglePanel, isExpanded, onToggleChat, setShowStickyNotes, setTaskManager }) => {
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
                            else if(val.title === 'Chatbot'){
                                onToggleChat(isExpanded);
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [showStickyNotes, setShowStickyNotes] = useState(false);
    const [showTaskManager, setTaskManager] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleTogglePanel = (currentIsOpen) => {
        setIsOpen(!currentIsOpen);
    };

    const handleToggleExpand = (currentIsExpand) => {
        setIsExpanded(!currentIsExpand)
    }

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

    return (
        <div className="mainP">
            <NavBar />
            <Chatbot 
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                onToggleExpand={toggleExpand}
            />
            <SideBar
                isOpen={isOpen}
                onTogglePanel={handleTogglePanel}
                onToggleChat={handleToggleExpand}
                isExpanded={isExpanded}
                setShowStickyNotes={setShowStickyNotes}
                setTaskManager={setTaskManager}
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
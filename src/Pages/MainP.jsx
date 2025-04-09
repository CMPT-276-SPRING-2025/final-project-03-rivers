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
import ProjectList from './Components/ProjectList.jsx';
import logo from '../assets/logo.png';

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

            <ul className="focusF flex items-center gap-2 ml-8">
                <li className="flex items-center gap-2">
                    <img
                    src={logo}
                    alt="Logo"
                    className="h-12 w-12 object-contain inline-block align-middle"
                    />
                    <span className="text-2xl ml-2.5 font-bold bg-gradient-to-r from-slate-700 to-indigo-400 bg-clip-text text-transparent">
                    FocusForge
                    </span>
                </li>
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

const SideBar = ({ isOpen, onTogglePanel, isExpanded, onToggleChat, setShowStickyNotes, setShowTaskManager, setShowProject }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    return (
        <div className={`Sidebar transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-44'}`}>
          <ul>
            {/* Toggle Button */}
            <li
              className="sidebar-item"
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
            >
              <div className="sidebar-icon">
                <svg className="h-6 w-6 text-gray-600" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </div>
              {!isSidebarCollapsed && <div className="sidebar-title">Menu</div>}
            </li>
    
            {/* Sidebar Data Items */}
            {SidebarData.map((val) => (
              <li
                key={val.title}
                onClick={() => {
                    if (val.title === 'Music') {
                      onTogglePanel(isOpen);
                    } else if (val.action === 'toggleStickyNotes') {
                      setShowStickyNotes(p => {
                        const next = !p;
                        if (next) {
                          setShowTaskManager(false);
                          setShowProject(false);
                          if(isOpen){
                            onTogglePanel(isOpen);
                          }
                        }
                        return next;
                      });
                    } else if (val.action === 'toggleTaskManager') {
                      setShowTaskManager(p => {
                        const next = !p;
                        if (next) {
                          setShowStickyNotes(false);
                          setShowProject(false);
                          if(isOpen){
                            onTogglePanel(isOpen);
                          }
                        }
                        return next;
                      });
                    } else if (val.action === 'toggleProject') {
                      setShowProject(p => {
                        const next = !p;
                        if (next) {
                          setShowStickyNotes(false);
                          setShowTaskManager(false);
                          if(isOpen){
                            onTogglePanel(isOpen);
                          }
                        }
                        return next;
                      });
                    } else if (val.title === 'Chatbot') {
                      onToggleChat(isExpanded);
                    } else {
                      window.location.pathname = val.link;
                    }
                  }}
                className="sidebar-item"
                title={isSidebarCollapsed ? val.title : ''}
              >
                <div className="sidebar-icon">{val.icon}</div>
                {!isSidebarCollapsed && <div className="sidebar-title">{val.title}</div>}
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
    const [showTaskManager, setShowTaskManager] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProject, setShowProject] = useState(false);
    const [isExitingTaskList, setIsExitingTaskList] = useState(false);

    const handleTogglePanel = (currentIsOpen) => {
        setIsOpen(!currentIsOpen);
    };

    const handleToggleExpand = (currentIsExpand) => {
        setIsExpanded(!currentIsExpand)
    }

    const handleToggleTaskManager = () => {
        if (showTaskManager) {
          setIsExitingTaskList(true);
          setTimeout(() => {
            setShowTaskManager(false);
            setIsExitingTaskList(false);
          }, 500); 
        } else {
          setShowTaskManager(true);
        }
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
                setShowTaskManager={setShowTaskManager} 
                handleToggleTaskManager={handleToggleTaskManager}
                setShowProject={setShowProject}
            />
            <Login
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <div className="content-area">
                {showStickyNotes && (
                  <StickyNotes setShowStickyNotes={setShowStickyNotes}/>
                )}

                {(showTaskManager || isExitingTaskList) && (
                tasks.length === 0 ? (
                    <TaskForm newTaskAdded={handleTaskAdded} />
                ) : (
                    <TaskList
                    tasks={tasks}
                    isExiting={isExitingTaskList}
                    setShowTaskManager={handleToggleTaskManager}
                    />
                )
                )}
                
                {showProject && <ProjectList />}
            </div>
            
        </div>
    );
};

export default MainP;
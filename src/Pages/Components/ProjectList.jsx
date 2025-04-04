import React, { useState, useEffect, useRef } from 'react';
import { fetchTasks, fetchProjects, deleteTask, closeTask, reopenTask, updateTask } from './Todo';
import "./ProjectList.css"

const ProjectList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectHeights, setProjectHeights] = useState({});
  const projectRefs = useRef({});

  useEffect(() => {
    const getProjectsAndTasks = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        const filteredProjects = fetchedProjects.filter(
          project => project.name.toLowerCase() !== "inbox"
        );
        setProjects(filteredProjects);

        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching projects or tasks:", error);
      }
    };
    getProjectsAndTasks();
  }, []);

  useEffect(() => {
    const updateHeights = () => {
      const newHeights = {};
      projects.forEach(project => {
        // Count how many tasks are in this project
        const taskCount = tasks.filter(task => task.projectId === project.id).length;
        
        const baseHeight = 145;
        const additionalHeight = 55; 
        
        const totalHeight = taskCount > 1 ? baseHeight + (taskCount - 1) * additionalHeight : baseHeight;
  
        newHeights[project.id] = totalHeight;
      });
  
      setProjectHeights(newHeights);
    };
  
    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [tasks, projects]);

  const handleCompletedTask = async (taskId, isCompleted) => {
    try {
      if (isCompleted) {
        await reopenTask(taskId);
      } else {
        await closeTask(taskId);
      }
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !isCompleted } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task) => {
    // Handle edit task functionality here
    console.log('Edit task: ', task);
  };

  return (
    <div className="project-list-container">
      {projects.length === 0 ? (
        <div className="no-projects text-center text-black text-xl">
          <p>No projects yet</p>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => {
            const projectTasks = tasks.filter((task) => task.projectId === project.id);

            return (
              <div
                key={project.id} 
                ref={el => projectRefs.current[project.id] = el}
                className="task-item rounded-lg"
                style={{ height: projectHeights[project.id] || 'auto' }}
              >

              <div className="absolute top-0 right-0 p-4">
                  <button
                    className="text-red-600 text-4xl font-medium rounded hover:cursor-pointer mb-2"
                    onClick={() => handleDeleteProject(project.id)} // Handle project delete or hide
                  >
                    &times;
                  </button>
                </div>
                
                {/* Project Name */}
                <div className="flex justify-center items-center w-full">
                  <span className="text-2xl font-bold text-black mb-6">{project.name}</span>
                </div>


                {projectTasks.length === 0 ? (
                  <div className="no-tasks text-center text-gray-500 italic">
                    No tasks assigned...
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    
                    {projectTasks.map((task) => (
                      <li 
                        key={task.id} 
                        className="flex items-center justify-between relative p-4"
                      >
                        {/* Task Name and Edit Features in one box */}
                        <div className="flex items-center w-full">
                          <div className="flex items-center w-full">
                            <input
                              type="checkbox"
                              className="mr-2 cursor-pointer"
                              checked={task.completed || false}
                              onChange={() => handleCompletedTask(task.id, task.completed)}
                            />
                            <span
                              className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-black"}`}
                            >
                              {task.content}
                            </span>
                          </div>

                          {/* Edit and Delete options */}
                          <div className="flex items-center ml-2">
                            <button className="mr-2" onClick={() => handleEditTask(task)}>
                              {/* Edit Icon */}
                              <svg className="cursor-pointer h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                                <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                              </svg>
                            </button>
                            <button
                              className="cursor-pointer text-red-600 text-2xl font-bold hover:text-red-700"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              &times;
                            </button>
                          </div>
                        </div>

                        {task.due && (
                          <div className="due-date ml-4 text-sm rounded-md text-center">
                            <strong>{task.due.date}</strong>
                          </div>
                        )}

                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectList;

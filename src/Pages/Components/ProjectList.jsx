import React, { useState, useEffect, useRef } from 'react';
import { fetchTasks, fetchProjects, deleteTask, closeTask, reopenTask, deleteProject } from './Todo';
import "./ProjectList.css"

const ProjectList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectHeights, setProjectHeights] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
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

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));

    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const confirmDeleteProject = async () => {
      try {
        await deleteProject(projectToDelete.id);
        setProjects(prevProjects => 
          prevProjects.filter(p => p.id !== projectToDelete.id)
        );
        setProjectId(prevId => prevId === projectToDelete.id ? '' : prevId);
        setShowDeleteConfirm(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    };
  
    const handleCancelDelete = () => {
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }; 

  return (
    <div className="project-list-container">
      {projects.length === 0 ? (
        <div className="no-projects mt-64 text-center text-black text-2xl">
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
                className="task-item rounded-lg relative"
                style={{ height: projectHeights[project.id] || 'auto' }}
              >
                {/* Project Name and Close Button Container */}
                <div className="flex justify-between items-center w-full mb-6">
                  <span className="text-2xl font-bold text-black text-center">{project.name}</span>
                  
                  <button
                    className="absolute top-4 right-4 text-red-600 text-3xl font-normal cursor-pointer hover:text-red-700"
                    onClick={() => handleDeleteProject(project.id)} // Handle project delete or hide
                  >
                    &times;
                  </button>
                </div>

                {showDeleteConfirm && projectToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Delete Project: {projectToDelete.name}?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      This action cannot be undone. Task in this project can be view in To-Do List Tab.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        onClick={handleCancelDelete}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={confirmDeleteProject}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
                
                {/* Task list or "No tasks assigned..." */}
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
                        {/* Task Name and Edit Features */}
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

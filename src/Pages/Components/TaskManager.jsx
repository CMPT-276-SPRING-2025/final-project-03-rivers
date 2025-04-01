import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addTask, fetchTasks, addProject, fetchProjects } from "./Todo";  
import './TaskManager.css';

const TaskManager = () => {
  const [task, setTask] = useState("");  
  const [dueDate, setDueDate] = useState("");  
  const [projectId, setProjectId] = useState("");
  const [tasks, setTasks] = useState([]);  
  const [projects, setProjects] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [showCreateProject, setShowCreateProject] = useState(false); 
  const [newProjectName, setNewProjectName] = useState(""); 
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch tasks and projects from Todoist
        const fetchedTasks = await fetchTasks();
        console.log("fetched tasks in task manager", fetchedTasks);
        const fetchedProjects = await fetchProjects();
        
        setTasks(fetchedTasks); 
        setProjects(fetchedProjects); 
        setLoading(false);  
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    loadData();  
  }, []); 

  const handleCreateProject = async () => {
    if (newProjectName.trim() === "") return; // Ensure the project name isn't empty

    try {
      const newProject = await addProject(newProjectName);
      setProjects((prevProjects) => [...prevProjects, newProject]); 
      setProjectId(newProject.id); 
      setShowCreateProject(false);  // Hide the input after creating the project
      setNewProjectName(""); // Clear the input field
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Handle adding a task
  const handleAddTask = async () => {
    if (task.trim() === "") return; 
  
    try {
      const newTask = await addTask(task, dueDate, projectId || null);  // If no project, pass null
      console.log("New Task Added:", newTask); 

      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
      
      setTask("");  
      setDueDate("");  
      setProjectId("");  
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  const renderTaskProject = (task) => {
    const project = projects.find((project) => project.id === task.projectId);
    return project ? project.name : "No Project"; 
  };

  return (
    <div className="task-list-container p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-center text-3xl font-bold mb-4">Task Manager</h2>

      {/* Input and Button for adding a task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="p-2 rounded w-full bg-white"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      {/* Due Date Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="p-2 rounded w-full bg-white"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {/* Project Dropdown */}
      <div className="flex gap-2 mb-4">
        <select
          className=" p-2 rounded w-full bg-white"
          value={projectId} 
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Button to show the project creation input */}
        <button
          className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-900"
          onClick={() => setShowCreateProject(true)} 
        >
          Create Project
        </button>
      </div>

      {/* Display input field to create project if showCreateProject is true */}
      {showCreateProject && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="p-2 rounded w-full bg-white"
            placeholder="Enter new project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleCreateProject}
          >
            Save Project
          </button>
        </div>
      )}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleAddTask}
      >
        Create Task
      </button>

      {/* Displaying the task list */}
      <h3 className="text-center mt-4 text-2xl font-semibold">To Do List</h3>
      <ul>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="mt-2">
              <strong>{task.content}</strong>
              {task.due ? <span> - Due: {task.due.string}</span> : null}
              <span> - Project: {renderTaskProject(task)}</span>
            </li>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskManager;

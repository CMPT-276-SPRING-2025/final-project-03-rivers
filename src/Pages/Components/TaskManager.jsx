import React, { useState, useEffect } from "react";
import { addTask, fetchTasks, addProject, fetchProjects } from "./Todo";  
import './TaskManager.css';

const TaskManager = () => {
  const [task, setTask] = useState("");  
  const [dueDate, setDueDate] = useState("");  
  const [projectId, setProjectId] = useState("");
  const [tasks, setTasks] = useState([]);  
  const [projects, setProjects] = useState([]);  
  const [loading, setLoading] = useState(true);  
 
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
    const newProjectName = prompt("Enter the new project name:");
    if (newProjectName) {
      try {
        const newProject = await addProject(newProjectName);
        setProjects((prevProjects) => [...prevProjects, newProject]); 
        setProjectId(newProject.id); 
      } catch (error) {
        console.error("Error creating project:", error);
      }
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
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Task Manager</h2>

      {/* Input and Button for adding a task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      {/* Due Date Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border p-2 rounded w-full"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {/* Project Dropdown */}
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded w-full"
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
        {/* Button to create a new project */}
        <button
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          onClick={() => handleCreateProject()}
        >
          Create Project
        </button>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleAddTask}
      >
        Add Task
      </button>

      {/* Displaying the task list */}
      <h3 className="mt-4 text-lg font-semibold">To Do List</h3>
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

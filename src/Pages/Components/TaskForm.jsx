import React, { useState, useEffect } from "react";
import { addTask, addProject, fetchProjects } from "./Todo";  
import "./TaskManager.css"

const TaskForm = ({ newTaskAdded }) => {
  const [task, setTask] = useState("");  
  const [dueDate, setDueDate] = useState("");  
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState(""); 
  const [showCreateProject, setShowCreateProject] = useState(false); 

  const handleAddTask = async () => {
    if (task.trim() === "") return; 

    try {
      const newTask = await addTask(task, dueDate, projectId || null);  // If no project, pass null
      setTask("");  
      setDueDate("");  
      setProjectId(""); 

      newTaskAdded(newTask);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim() === "") return;

    try {
      const newProject = await addProject(newProjectName);
      setProjects((prevProjects) => [...prevProjects, newProject]);
      setProjectId(newProject.id);
      setShowCreateProject(false);
      setNewProjectName(""); // Clear input after saving project
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Fetch the projects in the TaskForm component
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="task-form-container p-4 shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-bold mb-4">Create Task</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="p-2 rounded w-full bg-white"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="p-2 rounded w-full bg-white"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <select
          className="p-2 rounded w-full bg-white"
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

        <button
          className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-900"
          onClick={() => setShowCreateProject(true)}
        >
          Create Project
        </button>
      </div>

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
    </div>
  );
};

export default TaskForm;

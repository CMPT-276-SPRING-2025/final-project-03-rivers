import React, { useState, useEffect } from "react";
import { addTask, addProject, fetchProjects } from "./Todo";  
import "./TaskManager.css"

const TaskForm = ({ newTaskAdded, setShowForm}) => {
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

  const handleCancel = () => {
    setTask("");
    setDueDate("");
    setProjectId("");
    setNewProjectName("");
    setShowCreateProject(false);
    setShowForm(false); 
    
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
    <div className="task-form-container p-6 shadow-xl rounded-lg w-md mx-auto max-w-xl">
      <h2 className="text-center text-3xl font-bold mb-6">Create Task</h2>

      <div className="mb-2">
        <textarea
          className="task-input bg-white p-2 w-full h-32 rounded-lg"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      <div className="mb-2 flex items-center gap-2">
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
          className="add-project-btn p-2 bg-white text-gray-600 rounded"
          onClick={() => setShowCreateProject(true)}
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    
      {showCreateProject && (
        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            className="p-2 rounded w-full bg-white"
            placeholder="Enter new project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            className="save-project-btn p-2 bg-blue-600 text-white rounded"
            onClick={handleCreateProject}
          >
            ok
          </button>
        </div>
      )}

      <div className="relative mt-2 h-24">
          <div className="absolute bottom-0 left-0 flex flex-col gap-3">
            <button
              className="create-task-btn bg-blue-400 text-gray px-4 py-2 rounded-lg hover:bg-blue-500 w-32"
              onClick={handleAddTask}
            >
              Create Task
            </button>

            <button
              className="cancel-btn bg-red-400 text-blackpx-4 py-2 rounded-lg hover:bg-red-500 w-32"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          <div className="absolute bottom-0 right-0">
            <input
              type="date"
              className="due-date-btn p-7 w-56 h-24 bg-white rounded-lg border border-gray-300 text-lg"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </div>
  );
};

export default TaskForm;

import React, { useState, useEffect } from "react";
import { addTask, updateTask, addProject, fetchProjects, deleteProject } from "./Todo";  
import "./TaskManager.css"

const TaskForm = ({ newTaskAdded, setShowForm, taskToEdit, onSave }) => {
  const [task, setTask] = useState("");  
  const [dueDate, setDueDate] = useState("");  
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState(""); 
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleDeleteProject = async (project) => {
    try {
      setProjectToDelete(project);
      setShowDeleteConfirm(true);
    } catch (error) {
      console.error("Error preparing project deletion:", error);
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
  
  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit.content);
      setDueDate(taskToEdit.due?.date || '');
      setProjectId(taskToEdit.projectId);
    }

    const loadProjects = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        
        // Filter out the Inbox (default Todoist project)
        const filteredProjects = fetchedProjects.filter(
          (project) => project.name.toLowerCase() !== "inbox"
        );
    
        console.log("Filtered projects:", filteredProjects);
        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    loadProjects();
  }, [taskToEdit]);

  const handleEditTask = async () => {
    try {
      const updatedTask = {
        id: taskToEdit.id,
        content: task || taskToEdit.content,
        due_date: dueDate === "" ? null : dueDate,
        project_id: projectId || taskToEdit.projectId
      };

      console.log("Updating task:", updatedTask);
      await onSave(updatedTask);
      setShowForm(false);

    } catch (error) {
      console.error("Error editing task:", error);
    }
  };
  
  const handleAddTask = async () => {
    if (task.trim() === "") return; 

    try {
      const newTask = await addTask(task, dueDate, projectId);  
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

      setTimeout(() => setShowWarning(true), 0);

    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="task-form-container p-6 shadow-xl rounded-lg w-md mx-auto max-w-xl">
      <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent">
        {taskToEdit ? "Edit Task" : "Create Task"}
      </h2>

      <div className="mb-2">
        <textarea
          className="task-input bg-white p-2 w-full h-32 rounded-lg text-black"
          placeholder="Enter task..."
          value={task}
          maxLength={100}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>
      <div className="text-right text-sm text-gray-500 mb-4">
        {task.length}/100 characters
      </div>

      <div className="mb-2 flex items-center gap-2">
        {!taskToEdit ? (
          <>
            {/* Project Select Dropdown */}
            <select
              className="p-2 rounded w-full bg-white text-black"
              value={projectId}
              onChange={(e) => {
                const selectedProjectId = e.target.value;
                setProjectId(selectedProjectId);
                if (selectedProjectId !== "") {
                  setShowWarning(true);
                }
              }}
            >
              <option value="">Select Project</option>
              {projects.length === 0 ? (
                <option disabled>No projects found</option>
              ) : (
                projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))
              )}
            </select>

            {/* Add Project Button */}
            <button
              className="add-project-btn p-2 bg-white text-black rounded"
              onClick={() => setShowCreateProject(true)}
            >
              <span className="text-xl">+</span>
            </button>

            {/* Delete Project Button */}
            {projectId && (
              <button
                className="delete-project-btn p-2 bg-white text-red-600 rounded"
                onClick={() => {
                  const projectToDelete = projects.find(p => p.id === projectId);
                  if (projectToDelete) {
                    handleDeleteProject(projectToDelete);
                  }
                }}
              >
                <span className="text-xl">×</span>
              </button>
            )}
          </>
        ) : (
          <>
            <div className="p-2 rounded w-full bg-white text-black">
              <strong>Project:</strong>{" "}
              {projects.find((p) => p.id === projectId)?.name || "Unknown"}
            </div>

            <p className="ml-5 text-sm text-gray-500 italic">
              Project cannot be changed after assignment.
            </p>
          </>
        )}
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Project Assignment Notice
            </h3>
            <p className="text-gray-700 mb-4">
              After a task is assigned to a project, it cannot be reassigned later.
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => {
                  setProjectId(""); // reset project selection if canceled
                  setShowWarning(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setShowWarning(false); // confirm and keep selection
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateProject && (
        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            className="p-2 rounded w-full bg-white text-black"
            placeholder="Enter new project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            className="save-project-btn p-2 bg-blue-600 text-white rounded"
            onClick={handleCreateProject}
          >
            Create
          </button>
        </div>
      )}

      {showDeleteConfirm && projectToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Delete Project: {projectToDelete.name}?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure? This action cannot be undone. All tasks will be unassigned from this project.
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

      <div className="relative mt-2 h-24">
          <div className="absolute bottom-0 left-0 flex flex-col gap-3">
            <button
              className="create-task-btn bg-blue-400 text-gray px-4 py-2 rounded-lg hover:bg-blue-500 w-32"
              onClick={taskToEdit ? handleEditTask : handleAddTask}
            >
              {taskToEdit ? "Edit Task" : "Create Task"}
            </button>

            <button
              className="cancel-btn bg-red-400 text-black px-4 py-2 rounded-lg hover:bg-red-500 w-32"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          <div className="absolute bottom-0 right-0">
            <input
              type="date"
              className="due-date-btn p-7 w-56 h-24 bg-white rounded-lg border border-gray-300 text-lg text-black"
              value={dueDate}
              onChange={(e) => {
                console.log("Selected due date:", e.target.value);
                setDueDate(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
  );
};

export default TaskForm;

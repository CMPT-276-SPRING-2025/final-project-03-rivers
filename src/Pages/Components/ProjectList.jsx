import React, { useState, useEffect, useRef } from 'react';
import { fetchTasks, fetchProjects, deleteTask, closeTask, reopenTask, deleteProject, updateTask } from './Todo';
import "./ProjectList.css"
import ProjectEdit from './ProjectEdit';

const ProjectList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectHeights, setProjectHeights] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
        const additionalHeight = 60; 
        
        const totalHeight = taskCount > 1 ? baseHeight + (taskCount - 1) * additionalHeight : baseHeight;
  
        newHeights[project.id] = totalHeight;
      });
  
      setProjectHeights(newHeights);
    };
  
    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [tasks, projects]);

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await updateTask(updatedTask); 
  
      const newTasks = await fetchTasks(); 
      setTasks(newTasks); 
  
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

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
    setTaskToEdit(task);
    setShowEditModal(true);
  };

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
      const projectTasks = tasks.filter(task => task.projectId === projectToDelete.id);
      for (const task of projectTasks) {
        await deleteTask(task.id);
      }

      await deleteProject(projectToDelete.id);
  
      setProjects(prevProjects =>
        prevProjects.filter(p => p.id !== projectToDelete.id)
      );
      setTasks(prevTasks =>
        prevTasks.filter(task => task.projectId !== projectToDelete.id)
      );
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error deleting project and its tasks:", error);
    }
  };
  

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  return (
    <div className="task-form-container p-6 shadow-xl rounded-lg w-md mx-auto max-w-xl" data-testid="task-form">
    <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent" data-testid="task-form-title">
      {taskToEdit ? "Edit Task" : "Create Task"}
    </h2>
  
    <div className="mb-2">
      <textarea
        className="task-input bg-white p-2 w-full h-32 rounded-lg text-black"
        placeholder="Enter task..."
        value={task}
        maxLength={100}
        onChange={(e) => setTask(e.target.value)}
        data-testid="task-input"
      />
    </div>
    <div className="text-right text-sm text-gray-500 mb-4" data-testid="char-count">
      {task.length}/100 characters
    </div>
  
    <div className="mb-2 flex items-center gap-2">
      {!taskToEdit ? (
        <>
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
            data-testid="project-select"
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
  
          <button
            className="add-project-btn p-2 bg-white text-black rounded"
            onClick={() => setShowCreateProject(true)}
            data-testid="add-project-button"
          >
            <span className="text-xl">+</span>
          </button>
  
          {projectId && (
            <button
              className="delete-project-btn p-2 bg-white text-red-600 rounded"
              onClick={() => {
                const projectToDelete = projects.find(p => p.id === projectId);
                if (projectToDelete) {
                  handleDeleteProject(projectToDelete);
                }
              }}
              data-testid="delete-project-button"
            >
              <span className="text-xl">×</span>
            </button>
          )}
        </>
      ) : (
        <>
          <div className="p-2 rounded w-full bg-white text-black" data-testid="assigned-project-display">
            <strong>Project:</strong>{" "}
            {projects.find((p) => p.id === projectId)?.name || "Unknown"}
          </div>
          <p className="ml-5 text-sm text-gray-500 italic" data-testid="project-warning-text">
            Project cannot be changed after assignment.
          </p>
        </>
      )}
    </div>
  
    {showWarning && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="project-warning-modal">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Project Assignment Notice</h3>
          <p className="text-gray-700 mb-4">
            After a task is assigned to a project, it cannot be reassigned later.
            Are you sure you want to continue?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => {
                setProjectId("");
                setShowWarning(false);
              }}
              data-testid="project-warning-cancel"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowWarning(false)}
              data-testid="project-warning-confirm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
  
    {showCreateProject && (
      <div className="mb-2 flex items-center gap-2" data-testid="create-project-section">
        <input
          type="text"
          className="p-2 rounded w-full bg-white text-black"
          placeholder="Enter new project name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          data-testid="new-project-input"
        />
        <button
          className="save-project-btn p-2 bg-blue-600 text-white rounded"
          onClick={handleCreateProject}
          data-testid="create-project-button"
        >
          Create
        </button>
      </div>
    )}
  
    {showDeleteConfirm && projectToDelete && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="delete-project-modal">
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
              data-testid="cancel-delete-project"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={confirmDeleteProject}
              data-testid="confirm-delete-project"
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
          data-testid="submit-task-button"
        >
          {taskToEdit ? "Edit Task" : "Create Task"}
        </button>
  
        <button
          className="cancel-btn bg-red-400 text-black px-4 py-2 rounded-lg hover:bg-red-500 w-32"
          onClick={handleCancel}
          data-testid="cancel-task-button"
        >
          Cancel
        </button>
      </div>
  
      <div className="absolute bottom-0 right-0">
        <input
          type="date"
          className="due-date-btn p-7 w-56 h-24 bg-white rounded-lg border border-gray-300 text-lg text-black"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          data-testid="due-date-input"
        />
      </div>
    </div>
  </div>
  
  );
};

export default ProjectList;

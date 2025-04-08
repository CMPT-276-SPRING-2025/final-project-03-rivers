import { TodoistApi } from "@doist/todoist-api-typescript";

// Lazy initialization of API
let api = null;

const getApi = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  return new TodoistApi(token);
};

const ensureApi = () => {
  if (!api) {
    api = getApi();
  }
  return api;
};

// Add Task
export const addTask = async (taskContent, dueDate, projectId = null) => {
  try {
    const api = ensureApi();
    const taskData = {
      content: taskContent,
      due_date: dueDate || "",
    };
    if (projectId) taskData.project_id = projectId;
    const task = await api.addTask(taskData);
    console.log("Adding task in Todoist:", taskData);
    return task;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Fetch Tasks
export const fetchTasks = async () => {
  try {
    const api = ensureApi();
    const response = await api.getTasks();
    console.log("Fetched tasks:", response);
    return response.results; // <-- Correct!
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};



// Delete Task
export const deleteTask = async (taskId) => {
  try {
    const api = ensureApi();
    await api.deleteTask(taskId);
    console.log(`Task with ID ${taskId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Update Task
export const updateTask = async (task) => {
  try {
    const api = ensureApi();
    console.log("Updating task in Todoist:", task);
    const updatedTask = await api.updateTask(task.id, {
      content: task.content,
      due_date: task.due_date || null,
      project_id: task.project_id || null,
    });
    console.log("Updated task:", updatedTask);
    return updatedTask;
  } catch (error) {
    console.error("Error updating task in Todoist:", error);
    throw error;
  }
};

// Close Task
export const closeTask = async (taskId) => {
  try {
    const api = ensureApi();
    await api.closeTask(taskId);
    console.log(`Task with ID ${taskId} closed successfully.`);
  } catch (error) {
    console.error("Error closing task:", error);
    throw error;
  }
};

// Reopen Task
export const reopenTask = async (taskId) => {
  try {
    const api = ensureApi();
    await api.reopenTask(taskId);
    console.log(`Task with ID ${taskId} reopened successfully.`);
  } catch (error) {
    console.error("Error reopening task:", error);
    throw error;
  }
};

// Add Project
export const addProject = async (projectName) => {
  try {
    const api = ensureApi();
    const project = await api.addProject({ name: projectName });
    return project; // just one project
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};


// Fetch Projects
export const fetchProjects = async () => {
  try {
    const projects = await api.getProjects();
    console.log("Projects from todoist:", projects);
    return projects.results;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};


// Delete Project
export const deleteProject = async (projectId) => {
  try {
    const api = ensureApi();
    await api.deleteProject(projectId);
    console.log(`Project with ID ${projectId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
















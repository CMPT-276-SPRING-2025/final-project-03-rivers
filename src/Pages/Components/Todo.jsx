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
    // Add the task to Todoist
    const taskData = {
      content: taskContent,
      due_date: dueDate || "",
    };
    if (projectId) taskData.project_id = projectId;
    const task = await api.addTask(taskData);

    return task;  
  } catch (error) {
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
    throw error;
  }
};



// Delete Task
export const deleteTask = async (taskId) => {
  try {
    const api = ensureApi();
    await api.deleteTask(taskId);
  } catch (error) {
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
    return updatedTask;
  } catch (error) {
    throw error;
  }
};

// Close Task
export const closeTask = async (taskId) => {
  try {
    const api = ensureApi();
    await api.closeTask(taskId);
  } catch (error) {
    throw error;
  }
};

// Reopen Task
export const reopenTask = async (taskId) => {
  try {
    const api = ensureApi();
    await api.reopenTask(taskId);
  } catch (error) {
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
    throw error;
  }
};


// Fetch Projects
export const fetchProjects = async () => {
  try {
    const projects = await api.getProjects();
    
    return projects.results;
  } catch (error) {
    throw error;
  }
};


// Delete Project
export const deleteProject = async (projectId) => {
  try {
    const api = ensureApi();
    await api.deleteProject(projectId);
  } catch (error) {
    throw error;
  }
};
















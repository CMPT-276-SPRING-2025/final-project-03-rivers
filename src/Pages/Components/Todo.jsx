import { TodoistApi } from "@doist/todoist-api-typescript";

const getApi = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  return new TodoistApi(token);
};

const api = getApi();

export const addTask = async (taskContent, dueDate, projectId = null) => {
  try {
    console.log("Adding task with:", taskContent, dueDate, projectId);
    // Add the task to Todoist
    const taskData = {
      content: taskContent,
      due_date: dueDate || "",
    };
    
    if (projectId) {
      taskData.project_id = projectId; 
    }
    const task = await api.addTask(taskData);
    console.log("Adding task in Todoist:", taskData);

    return task;  
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Fetch tasks from Todoist
export const fetchTasks = async () => {
  try {
    const tasks = await api.getTasks();
    console.log("Fetched tasks:", tasks);  
    return Array.isArray(tasks.results) ? tasks.results : [];  
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// delete task from Todoist
export const deleteTask = async (taskId) => {
  try {
    await api.deleteTask(taskId);
    console.log(`Task with ID ${taskId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateTask = async (task) => {
  try {
    console.log("Updating task in Todoist:", task);

    const updatedTask = await api.updateTask(task.id, {
      content: task.content,
      due_date: task.due_date || null,
      project_id: task.project_id || null
    });

    console.log("Updated task:", updatedTask);
    
    return updatedTask;
  } catch (error) {
    console.error("Error updating task in Todoist:", error);
    throw error;
  }
};

export const closeTask = async(taskId) => {
  try {
    await api.closeTask(taskId);
    console.log(`Task with ID ${taskId} close successfully.`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};


export const reopenTask = async(taskId) => {
  try {
    await api.reopenTask(taskId);
    console.log(`Task with ID ${taskId} reopen successfully.`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const addProject = async (projectName) => {
  try {
    const project = await api.addProject({ name: projectName });
    return project;  
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// Fetch projects from Todoist
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

export const deleteProject = async (projectId) => {
  try {
    await api.deleteProject(projectId);
    console.log(`Project with ID ${projectId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};


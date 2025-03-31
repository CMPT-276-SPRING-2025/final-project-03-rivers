import { TodoistApi } from "@doist/todoist-api-typescript";

// Initialize the Todoist API client with your token
const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN);

// Function to add a task to Todoist and return it
export const addTask = async (taskContent, dueDate, projectId) => {
  try {
    // Add the task to Todoist
    const task = await api.addTask({ 
      content: taskContent,
      due_string: dueDate,
      project_id: projectId  
    });

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
    return Array.isArray(tasks) ? tasks : [];  // Ensure it returns an array
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}


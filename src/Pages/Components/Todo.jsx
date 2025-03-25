import { TodoistApi } from "@doist/todoist-api-typescript";

// Initialize the Todoist API client with your token
const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN);

// Function to add a task to Todoist and return it
export const addTask = async (taskContent) => {
  try {
    // Add the task to Todoist
    const task = await api.addTask({ content: taskContent });
    return task;  // Return the task so React can update the list
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

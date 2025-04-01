import { TodoistApi } from "@doist/todoist-api-typescript";

const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN);


export const addTask = async (taskContent, dueDate, projectId = null) => {
  try {
    console.log("Adding task with:", taskContent, dueDate, projectId);
    // Add the task to Todoist
    const taskData = {
      content: taskContent,
      due_string: dueDate,
    };
    
    if (projectId) {
      taskData.project_id = projectId; 
    }
    const task = await api.addTask(taskData);

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
    return Array.isArray(tasks) ? tasks : [];  
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


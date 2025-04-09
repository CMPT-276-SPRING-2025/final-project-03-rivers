import { TodoistApi } from "@doist/todoist-api-typescript";

const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN);


export const addTask = async (taskContent, dueDate, projectId = null) => {
  try {
    // Add the task to Todoist
    const taskData = {
      content: taskContent,
    };

    if (dueDate) {
      taskData.due_date = dueDate;
    }
    
    if (projectId) {
      taskData.project_id = projectId; 
    }
    const task = await api.addTask(taskData);

    return task;  
  } catch (error) {
    throw error;
  }
};

// Fetch tasks from Todoist
export const fetchTasks = async () => {
  try {
    const tasks = await api.getTasks();
    return Array.isArray(tasks.results) ? tasks.results : [];  
  } catch (error) {
    throw error;
  }
};

// delete task from Todoist
export const deleteTask = async (taskId) => {
  try {
    await api.deleteTask(taskId);
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (task) => {
  try {
    console.log("Updating task in Todoist:", task);

    const updatedTask = await api.updateTask(task.id, {
      content: task.content,
      due_string: task.due_date === null ? "no date" : undefined,
      due_date: task.due_date || undefined,
      project_id: task.project_id || null,
    });

    return updatedTask;

  } catch (error) {
    throw error;
  }
};


export const closeTask = async(taskId) => {
  try {
    await api.closeTask(taskId);
  } catch (error) {
    throw error;
  }
};


export const reopenTask = async(taskId) => {
  try {
    await api.reopenTask(taskId);
  } catch (error) {
    throw error;
  }
};

export const addProject = async (projectName) => {
  try {
    const project = await api.addProject({ name: projectName });
    return project;  
  } catch (error) {
    throw error;
  }
};

// Fetch projects from Todoist
export const fetchProjects = async () => {
  try {
    const projects = await api.getProjects();
    
    return projects.results;
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await api.deleteProject(projectId);
  } catch (error) {
    throw error;
  }
};


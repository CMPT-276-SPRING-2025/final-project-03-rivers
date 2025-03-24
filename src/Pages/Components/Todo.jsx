const API_URL = "https://api.todoist.com/rest/v2/tasks";
const API_TOKEN = import.meta.env.VITE_TODOIST_API_TOKEN;

// Function to add a new task
export const addTask = async (taskContent) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: taskContent })
    });
    return response.json();
};

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = ({ setTasks }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodoistTasks = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        console.error("Authorization code not found.");
        navigate("/"); // or show a login again
        return;
      }

      try {
        // Step 1: Exchange code for access token
        const response = await axios.post("https://todoist.com/oauth/access_token", {
          client_id: import.meta.env.VITE_TODOIST_CLIENT_ID, 
          client_secret: import.meta.env.VITE_TODOIST_CLIENT_SECRET,
          code,
        });

        const accessToken = response.data.access_token;

        // Step 2: Save token to localStorage
        localStorage.setItem("todoist_token", accessToken);

        // Step 3: Use that token to fetch tasks
        const tasksResponse = await axios.get("https://api.todoist.com/rest/v2/tasks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setTasks(tasksResponse.data); // Update app state
        navigate("/home"); // Go to your main UI
      } catch (error) {
        console.error("Failed to complete Todoist OAuth flow:", error);
        alert("Something went wrong. Please try logging in again.");
        navigate("/");
      }
    };

    fetchTodoistTasks();
  }, [navigate, setTasks]);

  return <p>Connecting to Todoist...</p>;
};

export default Callback;

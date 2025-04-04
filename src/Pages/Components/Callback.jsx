import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = ({ setTasks }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodoistTasks = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          // Exchange the authorization code for an access token
          const response = await axios.post("https://todoist.com/oauth/access_token", {
            client_id: "09a61f99ddfe45618be2ffc1e4fba1b4", // Replace with your Todoist client ID
            client_secret: "52b4fb169b354697ba7ff9ae197568cf", // Replace with your Todoist client secret
            code,
          });

          const accessToken = response.data.access_token;

          // Fetch tasks from Todoist
          const tasksResponse = await axios.get("https://api.todoist.com/rest/v2/tasks", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setTasks(tasksResponse.data);

          // Redirect to home page after importing tasks
          navigate("/home"); // Use react-router-dom's navigate function
        } catch (error) {
          console.error("Error fetching Todoist tasks:", error);
          alert("Failed to fetch tasks from Todoist. Please try again.");
          navigate("/"); // Redirect to the main page or an error page
        }
      } else {
        console.error("Authorization code not found in URL.");
        alert("Authorization code is missing. Please try importing tasks again.");
        navigate("/"); // Redirect to the main page or an error page
      }
    };

    fetchTodoistTasks();
  }, [navigate, setTasks]);

  return <p>Loading...</p>;
};

export default Callback;
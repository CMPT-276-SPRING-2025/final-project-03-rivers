import { useState, useEffect } from "react";
import { TodoistApi } from "@doist/todoist-api-typescript";

const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN);

export default function TodoList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Log the API token to make sure it's correctly loaded
    console.log("API Token:", import.meta.env.VITE_TODOIST_API_TOKEN);

    api.getProjects()
      .then((projects) => {
        console.log("Fetched projects:", projects); // Log the fetched projects
        setProjects(projects);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  return (
    <div>
      <h2>Your Todoist Projects</h2>
      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </ul>
    </div>
  );
}

import { useState, useEffect } from "react";
import { TodoistApi } from "@doist/todoist-api-typescript"

const api = new TodoistApi(process.env.TODOIST_API_TOKEN)

const TodoList = () => {
    const [projects, setProjects] = useState([]);
  
    useEffect(() => {
      fetchProjects();
    }, []);
  
    const fetchProjects = async () => {
      try {
        const projectsList = await api.getProjects();
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    return (
      <div>
        <h2>Todoist Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TodoList;
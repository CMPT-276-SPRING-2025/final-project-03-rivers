import React, { useState, useEffect } from 'react';
import { fetchTasks, fetchProjects } from './Todo';  
import "./ProjectList.css"

const ProjectList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjectsAndTasks = async () => {
      try {
        // Fetch projects
        const fetchedProjects = await fetchProjects();
        
        // Filter out "Inbox" (default Todoist project)
        const filteredProjects = fetchedProjects.filter(
          (project) => project.name.toLowerCase() !== "inbox"
        );
    
        console.log("Filtered projects:", filteredProjects);
        setProjects(filteredProjects);

        // Fetch tasks after projects
        const fetchedTasks = await fetchTasks();
        console.log("Task fetched:", fetchedTasks);
        setTasks(fetchedTasks);

      } catch (error) {
        console.error("Error fetching projects or tasks:", error);
      }
    };

    getProjectsAndTasks();
  }, []); 

  return (
    <div className="project-list-container">
      <h2>Projects</h2>
      {projects.length === 0 ? (
        <div className="no-projects">
          <p>No projects yet</p>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div key={project.id} className="project-item">
              <h3 className="text-2xl text-black font-bold text-center mb-5">{project.name}</h3>
              <ul>
              {tasks
                .filter((task) => {
                  const match = task.projectId === project.id;
                  console.log(`Checking task "${task.content}" with project_id "${task.projectId}" against project "${project.name}" with id "${project.id}": ${match}`);
                  return match;
                })
                .map((task) => (
                  <li key={task.id}>{task.content}</li>
              ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;

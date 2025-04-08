import React from "react";

const ProjectList = ({ projects, tasks }) => {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name} Tasks</h3>
          <ul>
            {tasks
              .filter((task) => task.projectId === project.id)
              .map((task) => (
                <li key={task.id}>
                  <strong>{task.content}</strong>
                  {task.due?.string && <span> - Due: {task.due.string}</span>}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;

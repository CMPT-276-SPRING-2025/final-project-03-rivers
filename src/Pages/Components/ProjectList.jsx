import React from "react";

const ProjectList = ({ projects, tasks }) => {
  return (
    <div className="project-list-container">
      {projects.length === 0 ? (
        <div className="no-projects text-center text-black text-2xl">
          <p>No projects yet</p>
        </div>
      ) : (
        <div className="project-list task-item-animate">
          {projects.map((project) => {
            const projectTasks = tasks.filter((task) => task.projectId === project.id);
            return (
              <div
                key={project.id}
                ref={(el) => (projectRefs.current[project.id] = el)}
                className="task-item rounded-lg relative overflow-y-auto"
                style={{ maxHeight: '70vh', height: projectHeights[project.id] || 'auto' }}
              >
                {/* Project Name and Close Button Container */}
                <div className="flex justify-between items-center w-full mb-6">
                  <span className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent text-center flex-1">
                    {project.name}
                  </span>
                  
                  <button
                    className="absolute top-4 right-4 text-red-600 text-3xl font-normal cursor-pointer hover:text-red-700"
                    onClick={() => handleDeleteProject(project)}
                  >
                    &times;
                  </button>
                </div>
                
                {/* Task list or "No tasks assigned..." */}
                {projectTasks.length === 0 ? (
                  <div className="no-tasks text-center text-gray-500 italic">
                    No tasks assigned...
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {projectTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between relative p-4"
                      >
                        {/* Task Name and Edit Features */}
                        <div className="flex items-center w-full">
                          <div className="flex items-center w-full">
                            <input
                              type="checkbox"
                              className="mr-2 cursor-pointer"
                              checked={task.completed || false}
                              onChange={() => handleCompletedTask(task.id, task.completed)}
                            />
                            <span
                              className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-black"}`}
                            >
                              {task.content}
                            </span>
                          </div>
                          {/* Edit and Delete options */}
                          <div className="flex items-center ml-2">
                            <button className="mr-2" onClick={() => handleEditTask(task)}>
                              {/* Edit Icon */}
                              <svg className="cursor-pointer h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                                <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                              </svg>
                            </button>
                            <button
                              className="cursor-pointer text-red-600 text-2xl font-bold hover:text-red-700"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                        {task.due && (
                          <div className="due-date ml-4 text-sm rounded-md text-center text black">
                            <strong>{task.due.date}</strong>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectList;

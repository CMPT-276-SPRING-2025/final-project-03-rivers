import React, { useState, useEffect } from "react";
import { addTask as addTask, fetchTasks, fetchProjects, addProject } from "./Todo";
import './TaskManager.css';
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import ProjectList from "./ProjectList";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setTasks(await fetchTasks());
        setProjects(await fetchProjects());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  const handleAddTask = async (task, dueDate, projectName) => {
    try {
      let projectId = null;
      let project = projects.find((p) => p.name === projectName);

      if (projectName && !project) {
        const newProject = await addProject(projectName);
        setProjects([...projects, newProject]);
        projectId = newProject.id;
      } else if (project) {
        projectId = project.id;
      }

      const newTask = await addTask(task, dueDate, projectId);
      setTasks([...tasks, newTask]);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="task-manager">
      <button onClick={() => setIsPopupOpen(true)}>Add Task</button>
      
      <TaskForm
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        onAddTask={handleAddTask} 
      />

      <TaskList tasks={tasks.filter((task) => !task.projectId)} />
      <ProjectList projects={projects} tasks={tasks} />
    </div>
  );
};

export default TaskManager;

{/*const TaskManager = () => {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isCreatingTask, setIsCreatingTask] = useState(true);  
  const [hasDueDate, setHasDueDate] = useState(true);

  // Fetch tasks and projects
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        const fetchedProjects = await fetchProjects();

        setTasks(fetchedTasks);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  const handleAddTask = async () => {
    if (task.trim() === "") return;  // Only require task content

    try {
      // Check if project exists or create a new one
      const project = projects.find(proj => proj.name === selectedProject);
      let projectId = null;

      if (selectedProject && !project) {
        // If no project exists, create a new project
        const newProject = await addProject(selectedProject);
        setProjects([...projects, newProject]);
        projectId = newProject.id;
      } else if (project) {
        projectId = project.id;
      }

      // Add task with optional due date and assigned project
      const newTask = await addTask(task, hasDueDate ? dueDate : "", projectId);

      // If the task has a project, put it in the project-specific list
      if (projectId) {
        setTasks(prevTasks => [
          ...prevTasks.filter(taskItem => taskItem.projectId !== projectId), 
          newTask
        ]);
      } else {
        // Else, it goes to the to-do list
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }

      setTask("");
      setDueDate("");
      setSelectedProject("");
      setIsCreatingTask(false); 
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="task-manager-container">
      {isCreatingTask ? (
        <div className="task-creation-container">
          <div className="task-input-box p-4 bg-gray-100 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-bold mb-4">Create a Task</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="input"
                placeholder="Enter task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              {/* Due date section
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={hasDueDate}
                    onChange={(e) => setHasDueDate(e.target.checked)}
                    className="mr-2"
                  />
                  Add due date
                </label>

                {hasDueDate && (
                  <input
                    type="date"
                    className="input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                )}
              </div>

              {/* Allow typing in project name
              <input
                type="text"
                className="input"
                placeholder="Enter project name (optional)"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              />

              <button className="btn btn-sm" onClick={handleAddTask}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Once the task is created, show the tasks
          <div className="task-list-container">
            <h3 className="text-lg font-semibold">ToDo List</h3>
            <div className="task-box">
              <ul>
                {tasks
                  .filter((taskItem) => !taskItem.projectId) // General tasks without project
                  .map((taskItem) => (
                    <li key={taskItem.id} className="mt-2">
                      <strong>{taskItem.content}</strong>{" "}
                      {taskItem.due?.string && (
                        <span className="text-gray-500"> - Due: {taskItem.due.string}</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Render tasks for each project
          {projects.map((project) => (
            <div key={project.id} className="project-tasks-container">
              <h3 className="text-lg font-semibold">{project.name} Tasks</h3>
              <div className="task-box">
                <ul>
                  {tasks
                    .filter((taskItem) => taskItem.projectId === project.id)
                    .map((taskItem) => (
                      <li key={taskItem.id} className="mt-2">
                        <strong>{taskItem.content}</strong>{" "}
                        {taskItem.due?.string && (
                          <span className="text-gray-500"> - Due: {taskItem.due.string}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}

          <button className="btn btn-sm" onClick={() => setIsCreatingTask(true)}>
            Add Task
          </button>
        </>
      )}
    </div>
  );
};

export default TaskManager;*/}

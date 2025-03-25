import React, { useState, useEffect } from "react";
import { addTask as addTaskAPI, fetchTasks } from "./Todo"; // Import functions
import './TaskManager.css';

const TaskManager = () => {
  const [task, setTask] = useState(""); // State to manage task input
  const [tasks, setTasks] = useState([]); // Store tasks fetched from Todoist
  const [loading, setLoading] = useState(true); // Loading state to show while fetching tasks
  const [isCreatingTask, setIsCreatingTask] = useState(false); // State to manage the visibility of task creation window

  // Fetch tasks when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Fetch all tasks from Todoist
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks); // Set tasks in state
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    loadTasks(); // Run the loadTasks function when the component mounts
  }, []); // Empty dependency array to run only once on mount

  // Handle adding a task
  const handleAddTask = async () => {
    if (task.trim() === "") return; // Prevent adding empty tasks

    try {
      // Add the task to Todoist
      const newTask = await addTaskAPI(task);

      // Add the new task to the task list in the state
      setTasks((prevTasks) => [...prevTasks, newTask]);

      // Clear the input field and hide the task creation window
      setTask("");
      setIsCreatingTask(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  if (loading) return <p>getting tasks... </p>; // Show loading message while fetching tasks

  return (
    <div className="task-manager-container">
      {isCreatingTask ? (
        // Task Creation Window
        <div className="task-creation-container">
          <div className="task-input-box p-4 bg-gray-100 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-bold mb-4">Task Manager</h2>
            <div className="flex gap-2">
              <input 
                type="text" className="input"
                placeholder="Enter task..." 
                value={task} 
                onChange={(e) => setTask(e.target.value)} 
              />
              <button className="btn btn-sm" onClick={handleAddTask}> Create Task </button>
            </div>
          </div>
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => setIsCreatingTask(false)} // Close the creation window without adding a task
          >
            Cancel
          </button>
        </div>
      ) : (
        // Task List Window
        <div className="task-list-container">
          <h3 className="text-lg font-semibold">To-Do List</h3>
          <ul>
            {tasks.map((taskItem) => (
              <li key={taskItem.id} className="mt-2">{taskItem.content}</li>
            ))}
          </ul>
          <button className="btn btn-sm" onClick={() => setIsCreatingTask(true)}> Add Task </button>
        </div>
      )}
    </div>
  );
};

export default TaskManager;

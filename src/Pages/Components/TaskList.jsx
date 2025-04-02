import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask } from "./Todo";
import TaskForm from "./TaskForm";
import "./TaskManager.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showList, setShowList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

  const handleCompletedTask = (taskId) => {
    setCompletedTasks((prev) => ({
       ...prev, 
       [taskId]: !prev[taskId],
    }));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, []);

  const handleNewTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowForm(false);  
  };

  return (
    showList && ( // Only show the list if showList is true
      <div className="task-list-container p-6 rounded-lg w-1/4 relative">
        <h2 className="text-center text-black text-2xl font-bold mb-4">To-Do List</h2>

        <div className="absolute top-0 left-0 p-4">
          <button
            className="text-green-600 text-4xl font-medium top-0 left-0 rounded hover:cursor-pointer mb-2"
            onClick={() => setShowForm(true)} // Show form when clicked
          >
            +
          </button>
        </div>

        <div className="absolute top-0 right-0 p-4">
          <button
            className="text-red-600 text-4xl font-medium top-0 right-0 rounded hover:cursor-pointer mb-2"
            onClick={() => setShowList(false)} // Hide task list when clicked
          >
            &times;
          </button>
        </div>

        {showForm && (
          <>
            <div
              className="modal-overlay fixed inset-0 z-40"
              onClick={() => setShowForm(false)} // Close form if overlay is clicked
            />
            <div className="modal-form fixed inset-0 flex justify-center items-center z-50">
              <TaskForm newTaskAdded={handleNewTaskAdded} setShowForm={setShowForm}/>
            </div>
          </>
        )}

        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="mt-2 flex items-center relative">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={completedTasks[task.id] || false}
                  onChange={() => handleCompletedTask(task.id)}
                />

                <span
                  className={`text-sm ${
                    completedTasks[task.id] ? "line-through text-gray-500" : "text-black"
                  }`}
                >
                  {task.content}
                </span>

                {task.due ? <span className="text-sm"> - Due: {task.due.string}</span> : null}

                <button
                  className="ml-auto text-red-600 text-2xl font-bold hover:text-red-800"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  &times;
                </button>

              </li>
            ))}
          </ul>
        ) : (
          <p>No Task Available... </p>
        )}
      </div>
    )
  );
};

export default TaskList;

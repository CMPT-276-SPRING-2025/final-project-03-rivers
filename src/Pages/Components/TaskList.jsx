import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask, updateTask, closeTask, reopenTask } from "./Todo";
import TaskForm from "./TaskForm";
import "./TaskManager.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showList, setShowList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [editTask, setEditTask] = useState(null); 

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

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      const updatedTasks = await fetchTasks(); 
      setTasks(updatedTasks);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  const handleCompletedTask = (taskId) => {
    setCompletedTasks((prev) => ({
       ...prev, 
       [taskId]: !prev[taskId],
    }));

    if (!completedTasks[taskId]) {
      closeTask(taskId);  
    }
    else {
      reopenTask(taskId)
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

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
            onClick={() => {
              setShowForm(true); 
              setEditTask(null);

            }} // Show form when clicked and reset edit task state
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
              <TaskForm 
                newTaskAdded={handleNewTaskAdded} 
                setShowForm={setShowForm} 
                taskToEdit={editTask} 
                onSave={handleTaskUpdate}
              />
            </div>
          </>
        )}

        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="mt-2 flex items-center justify-between relative p-4">
                {/* Task Name and Edit Features in one box */}
                <div className="flex items-center w-full">
                  <div className="flex items-center flex-grow">
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
                  </div>

                  {/* Edit and Delete options */}
                  <div className="flex items-center ml-2">
                    <button
                      className="mr-1"
                      onClick={() => handleEditTask(task)}
                    >
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
                  <div className="due-date ml-4 text-sm rounded-md text-center">
                    <strong>{task.due.date}</strong>
                  </div>
                )}
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

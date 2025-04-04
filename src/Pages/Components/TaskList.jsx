import React, { useState, useEffect } from "react";
import { fetchTasks, deleteTask, updateTask, closeTask, reopenTask } from "./Todo";
import TaskForm from "./TaskForm";
import "./TaskManager.css";

const TaskList = ({ setShowTaskManager }) => {
  const [tasks, setTasks] = useState([]);
  const [showList, setShowList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [editTask, setEditTask] = useState(null); 
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // New state for closing animation

  const handleClose = () => {
    setIsClosing(true); 
    setTimeout(() => {
      setShowTaskManager(false); 
      setIsClosing(false); 
    }, 100); 
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await updateTask(updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === updatedTask.id ? response : t)
      );
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

    setTimeout(() => {
      setIsVisible(true);
    }, 800);  

  }, []);

  const handleNewTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowForm(false);  
  };


  return (
    
    showList && ( 
      <div
        className={`task-list-container 
          ${isClosing ? 'opacity-0 translate-y-4' : (!isVisible ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0')} 
          transition-all duration-300 ease-out 
          p-6 rounded-lg w-1/4 relative`}
      >
        {/* Form and Delete Buttons */}
      <h2 className="text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent text-2xl font-bold mb-4">To-Do List</h2>

        <div className="absolute top-0 left-0 p-4">
          <button
            className="text-green-600 text-4xl font-medium top-0 left-0 rounded hover:cursor-pointer mb-2"
            onClick={() => {
              setShowForm(true); 
              setEditTask(null);
            }}
          >
            +
          </button>
        </div>

        <div className="absolute top-0 right-0 p-4">
          <button
            className="text-red-600 text-4xl font-medium top-0 right-0 rounded hover:cursor-pointer mb-2"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        
        {showForm && (
          <>
            <div
              className="modal-overlay fixed inset-0 z-40"
              onClick={() => setShowForm(false)} 
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
                {/* Task and Buttons */}
                <div className="flex items-center w-full">
                  <div className="flex items-center flex-grow">
                    <input
                      type="checkbox"
                      className="text-black mr-2 cursor-pointer"
                      checked={completedTasks[task.id] || false}
                      onChange={() => handleCompletedTask(task.id)}
                    />
                    <span
                      className={`text-sm ${completedTasks[task.id] ? "line-through text-gray-500" : "text-black"}`}
                    >
                      {task.content}
                    </span>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center ml-2">
                    <button className="mr-2" onClick={() => handleEditTask(task)}>
                      
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
                  <div className="text-black due-date ml-4 text-sm rounded-md text-center">
                    <strong>{task.due.date}</strong>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-center mt-6">No Task Available... </p>
        )}
      </div>

      
    )
  );
};

export default TaskList;

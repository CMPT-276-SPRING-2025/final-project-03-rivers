import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask, updateTask, closeTask, reopenTask } from "./Todo";
import TaskForm from "./TaskForm";
import "./TaskManager.css";

const TaskList = ({ isExiting, setShowTaskManager }) => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [editTask, setEditTask] = useState(null);

  // when user edit task, handle that action by showing the modal and get the task to be edited
  const handleEditTask = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  // update task with new task name or due dates 
  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await updateTask(updatedTask);
      const newTasks = await fetchTasks();
      setTasks(newTasks);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // handle tassk completion if user tick or unticks the checkbox
  const handleCompletedTask = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));

    if (!completedTasks[taskId]) {
      closeTask(taskId);
    } else {
      reopenTask(taskId);
    }
  };

  // delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  // load task into project
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
    <>
      <div
        className={`task-list-container ${isExiting ? "list-popup-exit" : "list-popup"
        } p-6 rounded-lg w-1/3 max-h-[60vh] shadow-xl relative ml-20 flex flex-col `}
        data-testid="task-list-container"
      >
        <div className="sticky top-0 flex items-center justify-between" data-testid="task-header">
          <button
            className="text-green-600 text-3xl mb-6 font-semibold hover:cursor-pointer"
            onClick={() => {
              setShowForm(true);
              setEditTask(null);
            }}
            data-testid="add-task-button"
          >
            +
          </button>

          <h2
            className="text-3xl mt-3 mb-4 font-bold bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent text-center"
            data-testid="task-list-title"
          >
            To-Do List
          </h2>

          <button
            className="text-red-600 text-3xl font-semibold mb-6 hover:cursor-pointer"
            onClick={setShowTaskManager}
            data-testid="close-task-manager"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto mt-2 pr-2 flex-1 min-h-0" data-testid="task-list-scroll">
          {tasks.length > 0 ? (
            <ul data-testid="task-list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="mt-2 flex items-center justify-between relative p-4 task-item-animate"
                  data-testid={`task-${task.id}`}
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center flex-grow">
                      <input
                        type="checkbox"
                        className="text-black mr-2 cursor-pointer"
                        checked={completedTasks[task.id] || false}
                        onChange={() => handleCompletedTask(task.id)}
                        data-testid={`task-checkbox-${task.id}`}
                      />
                      <span
                        className={`text-sm ${completedTasks[task.id]
                          ? "line-through text-gray-500"
                          : "text-black"} break-words overflow-hidden w-full`}
                        style={{ wordBreak: "break-word" }}
                        data-testid={`task-content-${task.id}`}
                      >
                        {task.content}
                      </span>
                    </div>

                    <div className="flex items-center ml-2">
                      <button
                        className="mr-2"
                        onClick={() => handleEditTask(task)}
                        data-testid={`edit-task-button-${task.id}`}
                      >
                        <svg
                          className="cursor-pointer h-6 w-6 text-gray-500"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                          <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                        </svg>
                      </button>

                      <button
                        className="cursor-pointer text-red-600 text-2xl font-bold hover:text-red-700"
                        onClick={() => handleDeleteTask(task.id)}
                        data-testid={`delete-task-button-${task.id}`}
                      >
                        &times;
                      </button>
                    </div>
                  </div>

                  {task.due && (
                    <div
                      className="text-black due-date ml-4 text-sm rounded-md text-center"
                      data-testid={`task-due-${task.id}`}
                    >
                      <strong>{task.due.date}</strong>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-black" data-testid="no-tasks-message">
              No Task Available...
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <>
          <div
            className="modal-overlay fixed inset-0 z-40"
            onClick={() => setShowForm(false)}
            data-testid="task-form-overlay"
          />
          <div
            className="modal-form fixed inset-0 flex justify-center items-center z-50 bg-black/50"
            data-testid="task-form-modal"
          >
            <TaskForm
              newTaskAdded={handleNewTaskAdded}
              setShowForm={setShowForm}
              taskToEdit={editTask}
              onSave={handleTaskUpdate}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TaskList;

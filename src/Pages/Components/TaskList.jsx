import React, { useEffect, useState } from "react";
import { fetchTasks } from "./Todo";
import TaskForm from "./TaskForm";
import "./TaskManager.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showList, setShowList] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
      <div className="task-list-container p-4 shadow-lg rounded-lg w-1/4 mx-auto relative">
        <h2 className="text-center text-black text-3xl font-bold mb-4">To Do List</h2>

        <div className="absolute top-0 left-0 p-4">
          <button
            className="text-green-600 text-4xl font-medium top-0 left-0 p-2 rounded hover:cursor-pointer mb-2"
            onClick={() => setShowForm(true)} // Show form when clicked
          >
            +
          </button>
        </div>

        <div className="absolute top-0 right-0 p-4">
          <button
            className="text-red-600 text-4xl font-medium top-0 right-0 p-2 rounded hover:cursor-pointer mb-2"
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
              <li key={task.id} className="mt-2">
                <strong>{task.content}</strong>
                {task.due ? <span> - Due: {task.due.string}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    )
  );
};

export default TaskList;

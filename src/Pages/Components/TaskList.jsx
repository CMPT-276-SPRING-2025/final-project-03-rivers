import React, { useEffect, useState } from "react";
import { fetchTasks } from "./Todo";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
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
    <div className="task-list-container p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-center text-3xl text-black font-bold mb-4 ">To Do List</h2>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
        onClick={() => setShowForm(true)} // Show form when clicked
      >
        Add Task
      </button>

      {showForm && (
        <>
          <div
            className="text-blue modal-overlay fixed inset-0 z-40"
            onClick={() => setShowForm(false)} // Close form if overlay is clicked
          />
          <div className="text-black modal-form fixed inset-0 flex justify-center items-center z-50">
            <TaskForm newTaskAdded={handleNewTaskAdded} />
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
  );
};

export default TaskList;

// TaskList.jsx (Displays the tasks)
import React, { useEffect, useState } from "react";
import { fetchTasks } from "./Todo";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div className="task-list-container p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-center text-3xl font-bold mb-4">To Do List</h2>

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

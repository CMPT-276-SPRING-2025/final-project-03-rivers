import React, { useState, useEffect } from 'react';
import './ProjectList.css';

const ProjectEdit = ({ task: initialTask, onSave, onCancel }) => {
  const [content, setContent] = useState("");  
  const [dueDate, setDueDate] = useState("");  

  useEffect(() => {
    setContent(initialTask.content);
    setDueDate(initialTask.due?.date || '');
  }, [initialTask]);

  // handle retrieving new task info and updates it
  const handleEditTask = async () => {
    try {
      const updatedTask = {
        id: initialTask.id,
        content: content,
        due_date: dueDate,
      };

      console.log("Updating task:", updatedTask);
      await onSave(updatedTask);  
      onCancel();  

    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className="project-edit-container p-4 rounded-lg shadow-md w-full"
      data-testid="project-edit-container"
    >
      <h3
        className="text-3xl text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent font-bold mb-6"
        data-testid="edit-task-title"
      >
        Edit Task
      </h3>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text black w-full p-2 mb-4 rounded test-black bg-white"
        placeholder="Task name"
        data-testid="task-name-input"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 mb-10 rounded test-black bg-white text black"
        data-testid="task-date-input"
      />
      
      <div className="flex justify-end gap-2" data-testid="edit-task-buttons">
        <button
          className="text-black px-3 py-1 bg-white rounded hover:bg-gray-100"
          onClick={onCancel}
          data-testid="cancel-button"
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleEditTask}  
          data-testid="save-button"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProjectEdit;

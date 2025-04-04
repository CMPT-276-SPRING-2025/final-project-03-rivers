import React, { useState, useEffect } from 'react';
import './ProjectList.css';

const ProjectEdit = ({ task: initialTask, onSave, onCancel }) => {
  // Rename the state variable to avoid conflict
  const [content, setContent] = useState("");  
  const [dueDate, setDueDate] = useState("");  

  useEffect(() => {
    setContent(initialTask.content);
    setDueDate(initialTask.due?.date || '');
  }, [initialTask]);

  const handleEditTask = async () => {
    try {
      const updatedTask = {
        id: initialTask.id,
        content: content || initialTask.content,
        due_date: dueDate || initialTask.dueDate,
      };

      console.log("Updating task:", updatedTask);
      await onSave(updatedTask);  
      onCancel();  

    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  return (
    <div className="project-edit-container p-4 rounded-lg shadow-md w-80">
      <h3 className="text-3xl text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent font-bold mb-6">Edit Task</h3>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text black w-full p-2 mb-4 rounded test-black bg-white"
        placeholder="Task name"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2  mb-10 rounded test-black bg-white text black"
      />
      <div className="flex justify-end gap-2">
        <button
          className="text black px-3 py-1 bg-white rounded hover:bg-gray-100"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleEditTask}  
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProjectEdit;

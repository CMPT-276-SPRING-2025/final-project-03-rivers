import React from "react";

const ErrorMessage = ({ message, seconds, onClose }) => {
    if (!message) return null;

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 shadow-md">
            <p className="font-semibold pr-6">{message}</p>

            {/* Timer /}
            <span className="absolute top-1 right-8 text-xs text-red-500">
                {seconds}s
            </span>

            {/ Close button */}
            <button
                onClick={onClose}
                className="absolute top-0 right-1 text-red-500 text-2xl font-bold hover:text-red-700"
            >
                &times;
            </button>
        </div>
    );
};

export default ErrorMessage;
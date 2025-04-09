import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage';  // Import the ErrorMessage component

const StickyNotes = ({ setShowStickyNotes }) => {
    const [notes, setNotes] = useState([{ id: Date.now(), text: '' }]);
    const [error, setError] = useState("");
    const [errorTimer, setErrorTimer] = useState(5);  // Timer for the error message
    const MAX_NOTES = 5;
    const MAX_LENGTH = 100;

    // Function to handle timer countdown
    React.useEffect(() => {
        if (error && errorTimer > 0) {
            const timer = setInterval(() => {
                setErrorTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }

        // If the timer reaches 0, close the error message automatically
        if (errorTimer === 0) {
            setError(""); // Close the error message
        }
    }, [error, errorTimer]);

    const createNote = () => {
        if (notes.length >= MAX_NOTES) {
            setError("You can only create 5 sticky notes.");
            setErrorTimer(5);  // Reset the timer when error appears
            return;
        }
        const newNote = { id: Date.now(), text: '' };
        setNotes((prevNotes) => [...prevNotes, newNote]);
        setError(""); // Clear error if note is created successfully
        setErrorTimer(5); // Reset timer on successful creation
    };

    const updateNote = (id, newText) => {
        if (newText.length <= MAX_LENGTH) {
            setNotes(notes.map(note => note.id === id ? { ...note, text: newText } : note));
        }
    };

    const deleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        setError(""); // Clear error if a note is deleted
        setErrorTimer(5); // Reset timer on note delete
    };

    // Function to handle closing the error message
    const closeErrorMessage = () => {
        setError("");  // Clear error state when the "X" is clicked
        setErrorTimer(5); // Reset the timer
    };

    return (
        <div className="task-list-container p-6 rounded-lg w-1/3 max-h-[60vh] shadow-xl relative ml-20 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between">
                <button
                    onClick={createNote}
                    className="text-green-600 text-3xl font-semibold hover:cursor-pointer mb-6"
                >
                    +
                </button>

                <h2 className="text-3xl mt-3 mb-4 font-bold gradient-text text-center">
                    Sticky Notes
                </h2>

                <button
                    onClick={() => setShowStickyNotes(false)}
                    className="text-red-600 text-3xl font-semibold hover:cursor-pointer mb-6"
                >
                    &times;
                </button>
            </div>

            {/* Error Message with timer and close button */}
            <ErrorMessage
                message={error}
                seconds={errorTimer}
                onClose={closeErrorMessage}  // Passing close function to the ErrorMessage component
            />

            {/* Notes list */}
            <div className="overflow-y-auto mt-2 pr-2 flex-1 min-h-0">
                {notes.length === 0 ? (
                    <p className="text-black">No Notes Yet...</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {notes.map((note) => (
                            <li
                                key={note.id}
                                className="bg-yellow-200 rounded-lg px-4 py-2 shadow task-item-animate flex flex-col"
                            >
                                <div className="flex justify-between items-start">
                                    <textarea
                                        value={note.text}
                                        onChange={(e) => updateNote(note.id, e.target.value)}
                                        className="w-full bg-transparent outline-none resize-none text-base text-black"
                                        rows={3}
                                        placeholder="Type your note..."
                                        maxLength={MAX_LENGTH}
                                    />
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="ml-2 text-red-600 text-2xl font-bold hover:text-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 text-right mt-1">
                                    {note.text.length}/{MAX_LENGTH}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default StickyNotes;

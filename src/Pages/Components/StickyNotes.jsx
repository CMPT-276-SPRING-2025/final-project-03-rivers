import React, { useState, useEffect } from 'react';
import ErrorMessage from './ErrorMessage';

const StickyNotes = ({ setShowStickyNotes }) => {
    const [notes, setNotes] = useState([{ id: Date.now(), text: '' }]);
    const [error, setError] = useState("");
    const [errorTimer, setErrorTimer] = useState(5);
    const [isExiting, setIsExiting] = useState(false); // 👈 added for animation
    const MAX_NOTES = 5;
    const MAX_LENGTH = 100;

    useEffect(() => {
        if (error && errorTimer > 0) {
            const timer = setInterval(() => {
                setErrorTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }

        if (errorTimer === 0) {
            setError("");
        }
    }, [error, errorTimer]);

    const createNote = () => {
        if (notes.length >= MAX_NOTES) {
            setError("You can only create 5 sticky notes.");
            setErrorTimer(5);
            return;
        }
        const newNote = { id: Date.now(), text: '' };
        setNotes((prevNotes) => [...prevNotes, newNote]);
        setError("");
        setErrorTimer(5);
    };

    const updateNote = (id, newText) => {
        if (newText.length <= MAX_LENGTH) {
            setNotes(notes.map(note => note.id === id ? { ...note, text: newText } : note));
        }
    };

    const deleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        setError("");
        setErrorTimer(5);
    };

    const closeErrorMessage = () => {
        setError("");
        setErrorTimer(5);
    };

    // ✅ Exit animation and unmount
    const handleCloseStickyNotes = () => {
        setIsExiting(true); // Trigger exit animation
        setTimeout(() => {
            setShowStickyNotes(false); // Unmount after animation ends
        }, 300); // Duration matches your .list-popup-exit
    };

    return (
        <div className={`task-list-container p-6 rounded-lg w-1/3 max-h-[60vh] shadow-xl relative ml-20 flex flex-col ${isExiting ? 'list-popup-exit' : 'list-popup'}`}>
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

                {/* Close button */}
                <button
                    onClick={handleCloseStickyNotes}
                    className="text-red-600 text-3xl font-semibold hover:cursor-pointer mb-6"
                >
                    &times;
                </button>
            </div>

            {/* Error Message */}
            <ErrorMessage
                message={error}
                seconds={errorTimer}
                onClose={closeErrorMessage}
            />

            {/* Notes List */}
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

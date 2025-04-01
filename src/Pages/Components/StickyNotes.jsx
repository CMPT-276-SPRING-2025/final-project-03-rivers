import React, { useState } from 'react';
import './StickyNotes.css';

const StickyNotes = () => {
    const [notes, setNotes] = useState([{ id: Date.now(), text: '' }]);
    const MAX_NOTES = 5; // max number of sticky notes 

    // Function to create a new sticky note 
    const createNote = () => {

        //  check to see if sticky note limit has been reach 
        if(notes.length >= MAX_NOTES){
            alert("You can only create 5 sticky notes.");
            return;
        }
        const newNote = { id: Date.now(), text: '' };
        setNotes((prevNotes) => [...prevNotes, newNote]);
    };

    // Function to update a sticky note
    const updateNote = (id, newText) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? { ...note, text: newText } : note
            )
        );
    };

    // Function to delete a sticky note
    const deleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    };

    return (
        <div className="stickynotes-container">
            <div className="stickyNotesBase">
                {notes.map((note) => (
                    <div key={note.id} className="stickyNote">
                        {/*Add Button for sticky note*/}
                        <button className="addNoteBtn" onClick={(e) => {
                            e.stopPropagation();
                            createNote();
                        }}>
                            Create
                        </button>
                        {/*Delete Button for sticky note*/}
                        <button className="deleteNoteBtn" onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                        }}>
                            Delete
                        </button>
                        {/*Create textarea for each note*/}
                        <textarea className="textArea" value={note.text} onChange={(e) => updateNote(note.id, e.target.value)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StickyNotes;


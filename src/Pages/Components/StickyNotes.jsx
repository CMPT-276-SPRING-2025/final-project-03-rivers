import React, {useState} from 'react';
import './StickyNotes.css'; 

const StickyNotes = () => {
    const [notes, setNotes] = useState([]);

    // Function to create a new sticky note 
    const createNote = () => {
        const newNote = {
            id: Date.now(),
            text: '',
        }; 
        setNotes((prevNotes) => [...prevNotes, newNote]);
    };

    // Function to update a sticky note
    const updateNote = (id, newText) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? { ...note, text: newText } : note
            )
        );
    }

    // Function to delete a sticky note
    const deleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    };
    
    return(
        <div>StickyNotes</div>
    )
};
import React, { useState } from 'react';

const StickyNotes = () => {
    {/*Create a state hook to manage sticky notes*/}
    const [notes, setNotes] = useState([]);

    {/*Function to create sticky notes*/}
    const createNote = () => {
        const newNote = {
            id: Date.now(), 
            text: '',
        };
        setNotes([...notes, newNote]);
    }
}

export default StickyNotes;
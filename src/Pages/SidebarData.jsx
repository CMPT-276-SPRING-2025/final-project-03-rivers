import React from 'react'
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export const SidebarData = [
    {
        title: "Music",
        icon: <AudiotrackIcon />,
        link: "/music"
    },
    {
        title: "Sticky Notes",
        icon: <StickyNote2Icon />,
        action: "toggleStickyNotes"
    },
    {
        title: "To-Do List",
        icon: <ChecklistIcon />,
        action: "toggleTaskManager"
    },
    {
        title: "Projects",
        icon: <AssignmentTurnedInIcon/>,
        action: "toggleProject"

    },
    {
        title: "Chatbot",
        icon: <SmartToyIcon/>,
        link: "/chatbot"
    }
];

export default SidebarData;
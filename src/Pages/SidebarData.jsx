import React from 'react'
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ChecklistIcon from '@mui/icons-material/Checklist';
export const SidebarData = [
    {
        title: "Music",
        icon: <AudiotrackIcon />,
        link: "/stickyN"
    },
    {
        title: "Sticky Notes",
        icon: <StickyNote2Icon />,
        link: "/stickyN"
    },
    {
        title: "ToDoList",
        icon: <ChecklistIcon />,
        link: "/toDoL"
    }
];

export default SidebarData;
import React from 'react'
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
export const SidebarData = [
    {
        title: "Music",
        icon: <AudiotrackIcon />,
        link: "/music"
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
    },
    {
        title: "Projects",
        icon: <AssignmentTurnedInIcon/>,
        link: "projects"

    }
];

export default SidebarData;
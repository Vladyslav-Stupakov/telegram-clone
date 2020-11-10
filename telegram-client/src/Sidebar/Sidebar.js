import React from 'react'
import './Sidebar.css'
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import { IconButton } from '@material-ui/core'
import SidebarChat from './SidebarChat';

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <div className="sidebar__headerProfile">
                    <IconButton>
                        <ViewHeadlineIcon />
                    </IconButton>
                </div>
                <div className="sidebar__headerSearch">
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
                <SidebarChat />
            </div>
        </div>
    )
}

export default Sidebar

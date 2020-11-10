import { Avatar } from '@material-ui/core'
import React from 'react'
import './SidebarChat.css'

function SidebarChat() {
    return (
        <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info">
                <div className="chatName">Room</div>
                <div className="lastMessage">messagesd fsdfffff ffffff ff ffffff ffffffff fffffffffff ffffffffff ffffffffffffff ffff ffff fffffffffff</div>
                <div className="messageTime">12.22</div>
                <div className="messageCounter">1</div>
            </div>
        </div>
    )
}

export default SidebarChat

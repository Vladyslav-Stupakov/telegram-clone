import { IconButton, TextareaAutosize } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import MoodIcon from '@material-ui/icons/Mood';
import MicNoneIcon from '@material-ui/icons/MicNone';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import React from 'react'
import './Chat.css'
import ChatMessage from './ChatMessage';


function Chat() {
    return (
        <div className="chat">
            <div className="chat__header">
                <div className="chat__headerInfo">
                    <div className="header__chatName">Room</div>
                    <div className="lastSeen">5 minutes ago</div>
                </div>
                <div className="chat__headerButtons">
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <IconButton>
                        <ViewCompactIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <div className="chat__message chat__reciever">
            my message my messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy message
            <div className="timeStamp">{new Date().toLocaleTimeString()}</div>
        </div>
            </div>
            <div className="chat__footer">
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <form>
                    <TextareaAutosize placeholder="Type a message..."/>
                    <button type="submit"></button>
                </form>                              
                <IconButton>
                    <MoodIcon />
                </IconButton>
                <IconButton>
                    <MicNoneIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat

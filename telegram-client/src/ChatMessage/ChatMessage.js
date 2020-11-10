import React from 'react'

function ChatMessage() {
    return (
        <div className="chat__message">
            my message my messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy messagemy message
            <div className="timeStamp">{new Date().toLocaleTimeString()}</div>
        </div>
    )
}

export default ChatMessage

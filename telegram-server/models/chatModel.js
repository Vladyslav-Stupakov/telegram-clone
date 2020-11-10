import mongoose from 'mongoose'

const chatShema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            text: String,
            timestamp: String,
            media: [String],
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            isRead: {
                type: Boolean,
                default: false
            }
        },
    ],
});


chatShema.methods.generateChatLink = () => {
    return [...Array(20)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
}

const Chat = mongoose.model('Chat', chatShema)

export default Chat
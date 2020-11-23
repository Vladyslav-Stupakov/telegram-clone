import mongoose from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'

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
    link: String
});

chatShema.methods.generateLink = function () {
    this.link = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY)
    this.save()
}

const Chat = mongoose.model('Chat', chatShema)

export default Chat
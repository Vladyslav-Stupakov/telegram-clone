import mongoose from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'

const channelShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    description: {
        type: String,
        maxlength: 100
    },
    admins: [
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
            isRead: {
                type: Boolean,
                default: false
            }
        },
    ],
    link: String
});

channelShema.methods.generateLink = () =>{
    this.link = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY)
    this.save()
}

const Channel = mongoose.model('Channel', channelShema)

export default Channel
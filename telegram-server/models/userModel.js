import mongoose from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'
import { sendLetter } from '../services/emailService.js'

const userShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    surname: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    varified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         return /(.*[a-z].*)(.*[A-Z].*)(.*\d.*)/.test(v);
        //     },
        //     message: `Your password does not match all the requirements`
        // },
    },
    avatar: {
        type: String,
        default: ''
    },
    channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    blackList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lastSeenAt: {
        type: String,
        default: ''
    },
    confirmationToken: String
});

userShema.methods.sendConfirmation = function (res) {
    this.confirmationToken = this.generateConfirmationToken()
    this.save((err, document, isSaved) =>{
        if(err){
            return res.status(505).send({ err})
        }
        else{
            sendLetter(res, this)
        }
    })
}

userShema.methods.generateConfirmationToken = function () {
    return jsonwebtoken.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY, {expiresIn: '1 days'})
}

userShema.methods.generateAuthToken = function () {
    return jsonwebtoken.sign({ _id: this._id, name: this.name, surname: this.surname }, process.env.JWT_PRIVATE_KEY)
}

const User = mongoose.model('User', userShema)

export default User
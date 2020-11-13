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
    confirmationToken: {
        tokenString: {
            type: String,
            default: ''
        },
        expirationDate: Date
    }

});

userShema.methods.sendConfirmation = function (res) {
    const token = this.generateConfirmationToken()
    User.findOneAndUpdate({ _id: this._id }, { confirmationToken: token }, { new: true }, (err, user) => {
        if (err) {
            console.log('error 1')
            return res.status(500).send({ err })
        }
        else {
            sendLetter(res, user)
        }
    })
}

userShema.methods.generateConfirmationToken = function () {
    const tokenString = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY)
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 1)
    return { tokenString, expirationDate }
}

userShema.methods.generateAuthToken = function () {
    return jsonwebtoken.sign({ _id: this._id, name: this.name, surname: this.surname }, process.env.JWT_PRIVATE_KEY)
}

const User = mongoose.model('User', userShema)

export default User
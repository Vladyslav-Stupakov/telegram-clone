import mongoose from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'

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
    avatar : String,
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
    ]

});

userShema.methods.generateConfirmationToken = function() {
    return jsonwebtoken.sign({_id: this._id}, process.env.JWT_PRIVATE_KEY)
}

userShema.methods.generateAuthToken = function() {
    return jsonwebtoken.sign({_id: this._id, name: this.name, surname: this.surname}, process.env.JWT_PRIVATE_KEY)
}

const User = mongoose.model('User', userShema)

export default User
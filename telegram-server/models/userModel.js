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
    confirmationToken: String,
    isLogged: {
        type: Boolean,
        default: false
    },
});


userShema.methods.generateConfirmationToken = function () {
    this.confirmationToken = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1 days' })
    this.save()
}

// userShema.methods.generateAuthToken = function () {
//     return jsonwebtoken.sign({ _id: this._id, name: this.name, surname: this.surname }, process.env.JWT_PRIVATE_KEY)
// }

const User = mongoose.model('User', userShema)

export default User
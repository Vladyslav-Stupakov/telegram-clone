import express from 'express'
import logger from '../middlewares/logger.js';
import Chat from '../models/chatModel.js'
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';

const router = express.Router();


router.get('/', logger, async (req, res) => {
    const user = req.user
    const promises = [Channel.aggregate([
        {
            $match: { _id: { $in: user.channels } }
        },
        {
            $project:
            {
                _id: 1,
                name: 1,
                lastMessage: { $arrayElemAt: ["$messages", -1] }
            }
        }
    ]).exec(),
    Chat.aggregate([
        {
            $match: { _id: { $in: user.chats } }
        },
        {
            $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members",

            }
        },
        {
            $project:
            {
                _id: 1,
                'members._id': 1,
                'members.name': 1,
                lastMessage: { $arrayElemAt: ["$messages", -1] },
            }
        },
    ]).exec()
    ]
    Promise.all(promises)
        .then((result) => {
            let data = result.flat().sort((a, b) => {
                if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
                    return -1;
                }
                else {
                    if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            })
            return res.send({ data })
        })
        .catch((err) => {
            console.log(err);
        });
})

router.post('/addchat', (req, res) => {
    const chat = req.body
    Chat.create(chat, (err, newChat) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            User.updateMany({ _id: { $in: newChat.members } }, { $addToSet: { chats: newChat._id } }, (err) => {
                if (err) {
                    return res.status(500).send({ err })
                }
                else {
                    return res.status(200).send({ message: 'chat succefully created' })
                }
            })
        }
    })
})

router.patch('/addmember', (req, res) => {
    const data = req.body
    const promises = [
        Chat.findByIdAndUpdate(data.chatId, { $addToSet: { members: data.userId } }),
        User.findByIdAndUpdate(data.userId, { $addToSet: { chats: data.chatId } })
    ]
    Promise.all(promises)
        .then(() => { res.send({ message: 'new member added to chat' }) })
        .catch((err) => {
            console.log(err)
        })
})

router.delete('/deletechat', (req, res) => {
    const data = req.body
    const promises = [
        Chat.findByIdAndUpdate(data.chatId, { $pull: { members: data.userId } }),
        User.findByIdAndUpdate(data.userId, { $pull: { chats: data.chatId } })
    ]
    Promise.all(promises)
        .then(() => { res.send({ message: 'chat deleted' }) })
        .catch((err) => {
            console.log(err)
        })
})



router.post('/createchannel', (req, res) => {
    const chat = req.body
    Chat.create(chat, (err, newChat) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            User.updateMany({ _id: { $in: newChat.members } }, { $addToSet: { chats: newChat._id } }, (err) => {
                if (err) {
                    return res.status(500).send({ err })
                }
                else {
                    return res.status(200).send({ message: 'chat succefully created' })
                }
            })
        }
    })
})

router.patch('/follow', (req, res) => {
    const data = req.body
    const promises = [
        Chat.findByIdAndUpdate(data.chatId, { $addToSet: { members: data.userId } }),
        User.findByIdAndUpdate(data.userId, { $addToSet: { chats: data.chatId } })
    ]
    Promise.all(promises)
        .then(() => { res.send({ message: 'new member added to chat' }) })
        .catch((err) => {
            console.log(err)
        })
    //unfollow
})


router.delete('/deletechannel', (req, res) => {
    const data = req.body
    const promises = [
        Chat.findByIdAndUpdate(data.chatId, { $pull: { members: data.userId } }),
        User.findByIdAndUpdate(data.userId, { $pull: { chats: data.chatId } })
    ]
    Promise.all(promises)
        .then(() => { res.send({ message: 'chat deleted' }) })
        .catch((err) => {
            console.log(err)
        })
})



router.post('/', (req, res) => {
    const message = req.body;
    Channel.updateOne({ _id: req.query.id }, { $addToSet: { messages: message } }, (err, data) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            return res.status(201).send({ data })
        }
    })
})


export default router
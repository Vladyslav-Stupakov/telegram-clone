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
                lastMessage: { $arrayElemAt: ["$messages", -1] },
                type: 'channel'
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
                type: 'chat'
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
            newChat.generateLink()
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

router.delete('/leavechat', (req, res) => {
    const data = req.body
    const promises = [
        User.findByIdAndUpdate(data.userId, { $pull: { chats: data.chatId } }),
        Chat.findByIdAndUpdate(data.chatId, { $pull: { members: data.userId } })
    ]
    Promise.all(promises)
        .then(() => { res.send({ message: 'u successfully left chat' }) })
        .catch((err) => {
            console.log(err)
        })
})

router.delete('/deletechat', (req, res) => {
    const data = req.body
    Chat.findOneAndDelete({ _id: data.chatId, members: data.userId }, (error, chat) => {
        if (error) {
            return res.send(error)
        }
        if (!chat) {
            return res.send({ message: 'u must be a member to perform this operation' })
        }
        else {
            User.updateMany({ _id: { $in: chat.members } }, { $pull: { chats: chat._id } }, (err, result) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    res.send({ message: 'chat deleted' })
                }
            })
        }
    })
})



router.post('/createchannel', (req, res) => {
    const channel = req.body
    Channel.create(channel, (err, newChannel) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            newChannel.generateLink()
            return res.status(200).send({ message: 'channel succefully created' })
        }
    })

})

router.patch('/follow', (req, res) => {
    const data = req.body
    let promises = []
    if (data.follow) {
        promises = [
            Channel.findByIdAndUpdate(data.channelId, { $addToSet: { followers: data.userId } }),
            User.findByIdAndUpdate(data.userId, { $addToSet: { channels: data.channelId } })
        ]
    }
    else {
        promises = [
            Channel.findByIdAndUpdate(data.channelId, { $pull: { followers: data.userId } }),
            User.findByIdAndUpdate(data.userId, { $pull: { channels: data.channelId } })
        ]
    }
    Promise.all(promises)
        .then(() => { res.send({ message: data.follow ? 'followed' : 'unfollowed' }) })
        .catch((err) => {
            console.log(err)
        })
})


router.delete('/deletechannel', (req, res) => {
    const data = req.body
    Channel.findOneAndDelete({ _id: data.channelId, admins: data.userId }, (error, channel) => {
        if (error) {
            return res.send(error)
        }
        if (!channel) {
            return res.send({ message: 'u must be an admin to perform this operation' })
        }
        else {
            User.updateMany({ _id: { $in: chat.members } }, { $pull: { chats: chat._id } }, (err, result) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    res.send({ message: 'channel deleted' })
                }
            })
        }
    })
})



router.post('/', (req, res) => {
    const { type, message, id } = req.body;
    if (type === 'channel') {
        Channel.findByIdAndUpdate(id, { $addToSet: { messages: message } }, (err, data) => {
            if (err) {
                return res.status(500).send({ err })
            }
            else {
                return res.status(201).send({ message: 'message sent' })
            }
        })
    }
    else {
        message.author = req.user._id
        Chat.findByIdAndUpdate(id, { $addToSet: { messages: message } }, (err, data) => {
            if (err) {
                return res.status(500).send({ err })
            }
            else {
                return res.status(201).send({ message: 'message sent' })
            }
        })
    }

})


export default router
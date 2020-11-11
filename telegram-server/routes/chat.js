import express from 'express'
import logger from '../middlewares/logger.js';
import Chat from '../models/chatModel.js'
import Fawn from 'fawn'
import mongoose from 'mongoose'
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';

const router = express.Router();
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const user = await User.findOne({_id : req.query.id});
    const channels = await Channel.aggregate([
        {
            $match: { _id: {$in: user.channels} }
        },
        {
            $project:
            {
                _id: 1,
                name: 1,
                lastMessage: { $arrayElemAt: ["$messages", -1] }
            }
        }
    ])
    const chats = await Chat.aggregate([
        {
            $match: { _id: {$in: user.chats} }
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
    ])
    let chatsData = chats.concat(channels);
    chatsData.sort((a, b) =>{
        if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
            return -1;
        }
        else{
            if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
                return 1;
            }
            else{
                return 0;
            }
        }
    })
    return res.send(chatsData);
})

router.post('/chats', (req, res) => {
    const chat = req.body
    Chat.create(chat, (err, chatData) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            User.updateMany({ _id: { $in: chatData.members } }, { $addToSet: { chats: chatData._id } }, (err) => {
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


router.post('/channel', (req, res) => {
    const message = req.body;
    Chat.updateOne({ _id: req.query.id }, { $addToSet: { messages: message } }, (err, data) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            return res.status(201).send({ data })
        }
    })
})

router.get('/channel', (req, res) => {
    Chat.find((err, data) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            return res.status(200).send({ data })
        }
    }).populate('members', ['name', 'surname', '_id']);
})

export default router
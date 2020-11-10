import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import auth from './routes/auth.js'
import Pusher from 'pusher'
import Chat from './models/chatModel.js'
import User from './models/userModel.js'

const app = express()
const port = process.env.PORT || 9000

const conection_url = 'mongodb+srv://vladyslav:a7dGmEdhWFnn4iHZ@cluster0.fwphy.mongodb.net/telegram?retryWrites=true&w=majority'
mongoose.connect(conection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const pusher = new Pusher({
    appId: "1104557",
    key: "7c2eabd6eb5ada00a377",
    secret: "62964ba73b384a5ab1a0",
    cluster: "eu",
    useTLS: true
});

const db = mongoose.connection
db.once('open', () => {
    const chats = db.collection('chats')
    const changeStream = chats.watch();
})

app.use(express.json())
app.use(cors())
app.use('/', auth)


app.listen(port, () => console.log(`Listening on port ${port}...`))

app.get('/', (req, res) => res.status(200).send('hello'))

app.post('/chats', (req, res) => {
    const chat = req.body
    Chat.create(chat, (err, chatData) => {
        if (err) {
            return res.status(500).send({ err })
        }
        else {
            User.updateMany({ _id: { $in: chatData.members} }, { $addToSet : { chats:  chatData._id  } }, (err) =>{
                if(err){
                    return res.status(500).send({err})
                }
                else{
                    return res.status(200).send({message: 'chat succefully created'})
                }
            })
        }
    })
})

app.get('/', async (req, res) => {
    Chat.find((err, data) =>{
        if(err){
            return res.status(500).send({ err })
        }
        else{
            return res.status(200).send({ data })
        }
    }).populate('members', ['name', 'surname', '_id']);    
})


app.post('/channel', (req, res) =>{
    const message = req.body;
    Chat.updateOne({_id : req.query.id}, { $addToSet : { messages:  message  } }, (err, data) =>{
        if(err){
            return res.status(500).send({err})
        }
        else{
            return res.status(201).send({data})
        }
    })
})

app.get('/channel', (req, res) =>{
    Chat.find((err, data) =>{
        if(err){
            return res.status(500).send({ err })
        }
        else{
            return res.status(200).send({ data })
        }
    }).populate('members', ['name', 'surname', '_id']);
})
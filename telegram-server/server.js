import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import auth from './routes/auth.js'
import chat from './routes/chat.js'
import Pusher from 'pusher'


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
app.use('/main', chat);

app.listen(port, () => console.log(`Listening on port ${port}...`))

app.get('/', (req, res) => res.status(200).send('hello'))


import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import auth from './routes/auth.js'
import chat from './routes/chat.js'
import Pusher from 'pusher'


const app = express()
const port = process.env.PORT || 9000

const conection_url =  process.env.DB_CONNECTION_STRING
mongoose.connect(conection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const pusher = new Pusher({
    appId: process.env.PUSHER_ID ,
    key: process.env.PUSHER_KEY ,
    secret: process.env.PUSHER_SECRET,
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


import express from 'express'
import cors from 'cors'
import pusher from './config/pusherConfig.js'
import db from './config/dbConfig.js'
import session from 'express-session'
import passport from 'passport'
import auth from './routes/auth.js'
import chat from './routes/chat.js'
import connectMongo from 'connect-mongo'; 


const MongoStore = connectMongo(session);




const app = express()
const port = process.env.PORT || 9000


const sessionStore = new MongoStore({ url : process.env.DB_CONNECTION_STRING, collection: 'sessions'})

app.use(express.json())

app.use(cors())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth)
app.use('/main', chat);

app.listen(port, () => console.log(`Listening on port ${port}...`))



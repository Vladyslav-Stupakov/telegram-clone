import express from 'express'
import cors from 'cors'
import './config/pusherConfig.js'
import './config/dbConfig.js'
import session from 'express-session'
import passport from 'passport'
import auth from './routes/auth.js'
import chat from './routes/chat.js'
import connectMongo from 'connect-mongo'; 


const app = express()
const port = process.env.PORT || 9000

const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({ url : process.env.DB_CONNECTION_STRING, collection: 'sessions'})

app.use(express.json())

app.use(cors())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {maxAge: 604800000},
    unset: "destroy"
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth)
app.use('/main', chat);

app.listen(port, () => console.log(`Listening on port ${port}...`))



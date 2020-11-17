import mongoose from 'mongoose'

const conection_url =  process.env.DB_CONNECTION_STRING

mongoose.connect(conection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
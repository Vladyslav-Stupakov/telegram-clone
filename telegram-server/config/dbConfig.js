import mongoose from 'mongoose'

const conection_url =  process.env.DB_CONNECTION_STRING

export default mongoose.connect(conection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
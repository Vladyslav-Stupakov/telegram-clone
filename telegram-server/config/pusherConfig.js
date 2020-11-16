import Pusher from 'pusher'

export default new Pusher({
    appId: process.env.PUSHER_ID ,
    key: process.env.PUSHER_KEY ,
    secret: process.env.PUSHER_SECRET,
    cluster: "eu",
    useTLS: true
});
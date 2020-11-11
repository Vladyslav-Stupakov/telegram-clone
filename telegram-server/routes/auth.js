import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'


const router = express.Router();

router.post('/register', async(req, res) => {
    const user = req.body
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    User.create(user, (err, data) => {
        if (err) {
            if (err.code === 11000)
                return res.status(422).send({ err: 'Email already in use' })
        }
        else
            return res.status(201).send(`user created : ${data}`)
    })
});

router.post('/login', (req, res) => {
    const user = req.body;
    User.findOne({ email: user.email }, (err, user) => {
        if (err) {
            return res.status(400).send({err})
        }
        if (!user) {
            return res.status(404).send({ message: 'Account does not exis' })
        }
        else{
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(400).send({ message: 'Invalid credentials ' })
                }
                else {
                    const token = user.generateAuthToken()
                    return res.header('x-auth-token', token)
                }
            });
        }        
    })
});

export default router
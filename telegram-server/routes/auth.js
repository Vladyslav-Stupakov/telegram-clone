import express from 'express'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import User from '../models/userModel.js'


const router = express.Router();

router.post('/register', async (req, res) => {
    const user = req.body
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    User.create(user, (err, newUser) => {
        if (err) {
            if (err.code === 11000)
                return res.status(422).send({ err: 'Email already in use' })
        }
        else {
            newUser.sendConfirmation(res)
        }
    })
});

router.patch('/confirm', (req, res) => {
    const token = jsonwebtoken.verify(req.query.token, process.env.JWT_PRIVATE_KEY)
    User.findOne({_id: token._id}, (err, user) =>{
        if(err){
            return res.status(505).send({ err})
        }
        else{
            if(user.confirmationToken.expirationDate < new Date()){
                return res.status(200).send({message: 'link expired'})
            }
            else{
                user.varified = true;
                user.save((err, document, isSaved) =>{
                    if(err){
                        return res.status(505).send({ err})
                    }
                    else{
                        return res.status(200).send({message: 'email confirmed'})
                    }
                })                   
            }           
        }
    })
});

router.post('/login', (req, res) => {
    const user = req.body;
    User.findOne({ email: user.email }, (err, user) => {
        if (err) {
            return res.status(400).send({ err })
        }
        if (!user) {
            return res.status(404).send({ message: 'Account does not exis' })
        }
        else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(400).send({ message: 'Invalid credentials ' })
                }
                else {
                    const token = user.generateAuthToken()
                    return res.header('auth-token', token).send({ message: 'logged in' })
                }
            });
        }
    })
});

export default router
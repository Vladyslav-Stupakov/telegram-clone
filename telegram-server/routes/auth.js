import express from 'express'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import User from '../models/userModel.js'
import logger from '../middlewares/logger.js';
import passport from '../middlewares/passport.js'

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


router.get('/confirm', (req, res) => {
    return res.send({ message: 'confirm ur email by clicking on button' })
})

router.get('/fail', (req, res) => {
    return res.send({ err: 'error' })
})

router.get('/test', (req, res) => {
    return res.send({ test: 'test' })
})

router.patch('/confirm', (req, res) => {
    jsonwebtoken.verify(req.query.token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
        if(err){
            return res.status(401).send({err})
        }
        User.findOne({ _id: decoded._id }, (err, user) => {
            if (err) {
                return res.status(505).send({ err })
            }
            else {
                user.varified = true;
                user.save((err, document, isSaved) => {
                    if (err) {
                        return res.status(505).send({ err })
                    }
                    else {
                        return res.status(200).send({ message: 'email confirmed' })
                    }
                })
            }
        })
    })

});

router.post('/login', passport.authenticate('local', { failureRedirect: '/fail', successRedirect: '/confirm' }), (req, res) => {
    // const requestUser = req.body;
    // User.findOne({ email: user.email }, (err, user) => {
    //     if (err) {
    //         return res.status(400).send({ err })
    //     }
    //     if (!user) {
    //         return res.status(404).send({ message: 'Account does not exis' })
    //     }
    //     else {
    //         bcrypt.compare(requestUser.password, user.password, (err, result) => {
    //             if (err) {
    //                 return res.status(400).send({ message: 'Invalid credentials ' })
    //             }
    //             else {
    //                 const token = user.generateAuthToken()
    //                 return res.header('auth-token', token).send({ message: 'logged in' })

    //             }
    //         });
    //     }
    // })
});

export default router
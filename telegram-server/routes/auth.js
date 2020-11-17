import express from 'express'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import User from '../models/userModel.js'
import logger from '../middlewares/logger.js';
import passport from '../middlewares/passport.js'
import { sendLetter } from '../services/emailService.js'

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
            newUser.generateConfirmationToken()
            sendLetter(res, newUser)
        }
    })
});

router.get('/confirm', (req, res) => {
    return res.send({ message: 'confirm ur email by clicking on button' })
})

router.patch('/confirm', (req, res) => {
    jsonwebtoken.verify(req.query.token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ err })
        }
        User.findById(decoded._id, (err, user) => {
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

router.get('/login', (req, res) => {
    res.send({ message: 'login page' })
})


router.post('/login', passport.authenticate('local', ({ failureRedirect: '/login', successRedirect: '/main' })))
//,(req, res) => {
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
//})

router.post('/logout', (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            return res.send({ err })
        }
        else {
            user.isLogged = false
            user.save((err, u) => {
                if (err) {
                    return res.send({ err })
                }
                else {
                    req.session = null
                    res.redirect('/login')
                }
            })
        }
    });
})

export default router
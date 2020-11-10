import bcrypt from 'bcrypt'
import User from '../models/userModel.js'

export async function register(req, res) {
    const user = req.body
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    User.create(user, (err, data) => {
        if (err) {
            if (err.code === 11000)
                return res.status(422).send({ err: 'Email already in use' })
        }
        else
            return res.status(201).send(`user created : ${data}`)
    })
}

export async function login(req, res) {
    await User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            return res.status(400).json(err)
        }
        if (!user) {
            return res.status(404).json({ message: 'Account does not exis' })
        }
        const validPassword = await bcrypt.compare(req.body.password, client.password);
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid credentials ' });
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
    }).catch(err => console.log(err))
}


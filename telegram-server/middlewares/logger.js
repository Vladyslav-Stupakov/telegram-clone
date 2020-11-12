import jsonwebtoken from 'jsonwebtoken'

export default function logger(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) {
        return res.status(401).send({err: 'access denied'})
    }
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JwtPrivateKey)
        req.user = decoded
        next()
    }
    catch (e) {
        res.status(400).send('invalid token')
    }
}

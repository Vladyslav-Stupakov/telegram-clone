import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVER_MAIL,
        pass: process.env.SERVER_PASS
    }
});

export function sendConfirmation(res, user) {
    const token = user.generateConfirmationToken();
    const url = `http://localhost:3001/confirm?user=${token}`
    const mailOptions = {
        from: 'no-reply@telegram-clone',
        to: `${user.email}`,
        subject: 'Email confirmation',
        text: `Confirm email by visiting link:   ${url}`
    };
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).send({err})
        }
        else{
            return res.status(200).send({message: 'email sent'})
        }
    });
}
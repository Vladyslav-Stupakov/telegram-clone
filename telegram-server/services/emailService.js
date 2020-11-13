import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVER_MAIL,
        pass: process.env.SERVER_PASS
    }
});

export function sendLetter(res, user) {
    const url = process.env.URL + `/confirm?token=${user.confirmationToken.tokenString}`
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
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "anton.sokolovsky2@gmail.com",
        pass: "qqq55555"
    }
})

const createUserConfirmationEmail = async ({email, username, token}) => {
    const message = await transporter.sendMail({
        from: "'GYM' <anton.sokolovsky2@gmail.com>",
        to: `${email}`,
        subject: "Welcome in GYM",
        html: `
            <b>Hello ${username}!</b>
            <a href="http://localhost:5005/api/v1/auth/verify/${token}">Verify your mail</a>
                
        `,
    });
}

module.exports = {createUserConfirmationEmail}
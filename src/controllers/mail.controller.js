const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "anton.sokolovsky2@gmail.com",
        pass: "qqq55555"
    }
})

const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('src/email-templates'),
        defaultLayout: false,
    },
    viewPath: path.resolve('src/email-templates'),
    extName: ".handlebars",
}

transporter.use('compile', hbs(handlebarOptions));

const createUserConfirmationEmail = async (template, payload) => {
    await transporter.sendMail({
        from: "'GYM' <anton.sokolovsky2@gmail.com>",
        to: `${payload.email}`,
        subject: `${payload.title}`,
        template: template,
        context: {
            ...payload.data
        }

    });
}

module.exports = {createUserConfirmationEmail}

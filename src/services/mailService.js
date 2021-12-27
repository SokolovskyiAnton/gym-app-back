const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

class Mail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "anton.sokolovsky2@gmail.com",
                pass: "qqq55555"
            }
        })
        this.handlebarOptions = {
            viewEngine: {
                extName: ".handlebars",
                partialsDir: path.resolve('src/email-templates'),
                defaultLayout: false,
            },
            viewPath: path.resolve('src/email-templates'),
            extName: ".handlebars",
        }
        this.transporter.use('compile', hbs(this.handlebarOptions))
    }
    async createUserConfirmationEmail(template, payload) {
        await this.transporter.sendMail({
            from: "'GYM' <anton.sokolovsky2@gmail.com>",
            to: `${payload.email}`,
            subject: `${payload.title}`,
            template: template,
            context: {
                ...payload.data
            }
        })
    }
}
const MailService = new Mail()
module.exports = MailService

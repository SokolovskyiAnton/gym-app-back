const BasicSettings = require('./basicSettings')
const MailService = require("./mailService");

class AuthService extends BasicSettings {
    async getProfile(req, res) {
        try {
            const user = await this.checkUserAccess(req, res)
            const findUser = await this.models.User.findOne({email: user.email})
            return res.status(200).send({
                id: findUser._id,
                username: findUser.username,
                email: findUser.email,
                verifyAt: findUser.verifyAt
            })
        } catch (e) {
            return res.status(401).send({
                message: "Sorry, but user or email doesn't match"
            })
        }
    }
    async signUp(req, res) {
        const {email, password, username} = req.body
        try {
            const isEmailCorrect = /(?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
            const findUser = await this.models.User.findOne({email});
            if (findUser || !isEmailCorrect) {
                return res.status(401).send({
                    message: 'Sorry, this email is not available'
                });
            }
            const token = this.createToken('access', '', {email: email})

            const createUser = await new this.models.User({username, email, password, confirmEmail: token});
            const saveUser = await createUser.save();

            const data = {
                email: saveUser.email,
                title: 'Welcome in GYM',
                data: {
                    username: saveUser.username,
                    confirmEmail: saveUser.confirmEmail
                }
            }
            await MailService.createUserConfirmationEmail('welcome', data)

            return res.status(200).send({
                message: 'User is created'
            })
        } catch (e) {
            return res.status(401).send({
                message: "Sorry, but user or email doesn't match"
            });
        }
    }
    async login(req, res) {
        const {email, password} = req.body
        try {
            const findUser = await this.models.User.findOne({email})

            if (!findUser) {
                return res.status(401).send({
                    message: "Sorry, but user or email doesn't match"
                })
            }
            const isPasswordCorrect = findUser.password === password

            if (!isPasswordCorrect) {
                return res.status(401).send({
                    message: "Sorry, but user or email doesn't match"
                })
            }

            const accessToken = this.createToken('access', '30m', {
                _id: findUser._id,
                email: findUser.email
            })

            const refreshToken = this.createToken('refresh', '30day', {
                _id: findUser._id,
                email: findUser.email
            })
            const foundToken = await this.models.Token.findOne({
                user: findUser._id
            })

            if (foundToken) {
                await this.models.Token.findOneAndUpdate({user: findUser._id}, {token: accessToken}, {useFindAndModify: false})
                res.cookie('token', refreshToken, {maxAge: 3600 * 24 * 30})
                return res.status(200).send({
                    accessToken,
                    id: findUser._id,
                    username: findUser.username,
                    email: findUser.email,
                    verifyAt: findUser.verifyAt
                })
            }

            const item = await new this.models.Token({token: accessToken, user: findUser._id})
            item.save()
            res.cookie('token', refreshToken, {maxAge: 3600 * 24 * 30})
            return res.status(200).send({
                accessToken,
                id: findUser._id,
                username: findUser.username,
                email: findUser.email,
                verifyAt: findUser.verifyAt
            })
        } catch (e) {
            return res.status(401).send({
                message: 'User or password does not match'
            });
        }
    }
    async logout(req, res) {
        try {
            const user = await this.checkUserAccess(req, res)

            const foundToken = await this.models.Token.findOne({user: user._id})

            if (!foundToken) {
                return res.status(401).send({
                    message: "User isn't authorized"
                })
            }
            await this.models.Token.findByIdAndDelete(foundToken._id)
            res.clearCookie('token')

            return res.status(200).send({
                message: "User is logged out"
            })
        } catch (e) {
            return res.status(401).send({
                message: 'User or password does not match'
            })
        }
    }
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.token
            if (!refreshToken) {
                return res.status(401).send({
                    message: 'Forbidden'
                })
            }
            const isRefreshTokenValid = await this.verifyToken(refreshToken, 'refresh')
            if (!isRefreshTokenValid) {
                return res.status(401).send({
                    message: 'Forbidden'
                })
            }
            const decodeUser = await this.decodeToken(refreshToken, 'refresh')
            const currentToken = this.models.Token.findOne({user: decodeUser._id})
            if (!currentToken) {
                return res.status(401).send({
                    message: 'Forbidden'
                })
            }
            const accessToken = this.createToken('access', '30m', {
                _id: decodeUser._id,
                email: decodeUser.email
            })
            await this.models.Token.findOneAndUpdate({user: decodeUser._id}, {token: accessToken}, {useFindAndModify: false})

            return res.status(200).send({
                accessToken
            })
        } catch (e) {
            return res.status(401).send({
                message: 'User or password does not match'
            })
        }
    }
    async verifyEmail(req, res) {
        try {
            const token = req.params.token
            const decodeUser = await this.decodeToken(token, 'access')
            const findUser = await this.models.User.findOne({email: decodeUser.email})

            if (findUser.verifyAt) {
                return res.redirect('http://localhost:8080/auth/login')
            }

            await this.models.User.findOneAndUpdate({email: decodeUser.email}, {verifyAt: new Date()}, {useFindAndModify: false});
            return res.redirect('http://localhost:8080/auth/login');
        } catch (e) {
            return res.status(403).send({
                massage: 'Forbidden'
            })
        }
    }
    async forgotPassword(req, res) {
        try {
            const userEmail = req.body.email

            const token = this.createToken('access', '30m', {email: userEmail})
            await this.models.User.findOneAndUpdate({ email: userEmail }, { resetPassword: token }, {useFindAndModify: false})
            const findUser = await this.models.User.findOne({email: userEmail})
            const data = {
                email: findUser.email,
                title: 'Reset password',
                data: {
                    username: findUser.username,
                    resetPassword: findUser.resetPassword
                }
            }
            await MailService.createUserConfirmationEmail('reset', data)
            return res.status(200).send({
                message: 'Success'
            })
        } catch (e) {
            res.status(400).send({
                massage: 'Bad request'
            })
        }
    }
    async resetPassword(req, res) {
        try {
            const token = req.body.token;
            const isTokenVerify = this.verifyToken(token, 'access')
            if (!isTokenVerify) {
                return res.status(400).send({
                    massage: 'Bad request'
                })
            }
            const findUser = await this.models.User.findOne({resetPassword: token})
            if (!findUser) {
                return res.status(400).send({
                    massage: 'Bad request'
                })
            }
            await this.models.User.findOneAndUpdate({ _id: findUser._id }, { password: req.body.password, resetPassword: '' }, {useFindAndModify: false})

            return res.status(200).send({
                message: 'Success'
            })

        } catch (e) {
            res.status(400).send({
                massage: 'Bad request'
            })
        }
    }
}

module.exports = {AuthService}


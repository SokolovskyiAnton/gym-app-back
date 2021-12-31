require('dotenv').config();
const jwt = require('jsonwebtoken');
const {User, Token, Result, Exercise, Category} = require('../models');
const {verify, decode} = require("jsonwebtoken");

class BasicSettings {
    constructor() {
        this.models = {User, Token, Result, Exercise, Category}
    }
    createToken(key, expire, options) {
        const keyOfToken = key === 'access' ? process.env.JWT_SECRET : process.env.JWT_SECRET_REFRESH
        const expireOfToken = expire ? {expiresIn: expire} : {}
        return jwt.sign({...options}, keyOfToken, expireOfToken)
    }
    verifyToken(token, key) {
        const keyOfToken = key === 'access' ? process.env.JWT_SECRET : process.env.JWT_SECRET_REFRESH
        return verify(token, keyOfToken,(err) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        })
    }
    async decodeToken(token, key) {
        const keyOfToken = key === 'access' ? process.env.JWT_SECRET : process.env.JWT_SECRET_REFRESH
        return await decode(token, keyOfToken)
    }
    async checkUserAccess(req, res) {
        const authorization = req.headers.authorization
        if (!authorization) {
            return res.status(401).send({
                message: "User isn't authorized"
            })
        }
        const token = authorization.split(' ')[1];
        return await this.decodeToken(token, 'access')
    }
}

module.exports = BasicSettings

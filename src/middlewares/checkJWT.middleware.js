require('dotenv').config();
const {verify} = require('jsonwebtoken');

const checkJwtToken = async (req, res, next) => {
    const { headers: { authorization } } = req;

    if (authorization) {
        const token = authorization.split(' ')[1];
         verify(token, process.env.JWT_SECRET,async (err) => {
            if (err) {
                return res.status(403).send({
                    message: 'Forbidden'
                })
            } else {
                return next()
            }
        })
    } else {
        return res.status(403).send({
            message: 'Forbidden'
        })
    }
}

module.exports = {checkJwtToken}

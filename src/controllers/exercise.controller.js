const {Exercise} = require('../models')
const jwt = require("jsonwebtoken");

const relations = {
    getAll: 'results',
    get: 'results'
}

const checkUserAccess = async function (req) {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    const decodeUser = await jwt.decode(token, process.env.JWT_SECRET)
    return decodeUser
}

module.exports = {
    async get(req, res) {
        try {
            await checkUserAccess(req)
            const item = await Exercise.findById(req.query.id).populate(relations.get);
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async getAll(req, res) {
        try {
            const decodeUser = await checkUserAccess(req)

            const items = await Exercise.find({user: decodeUser.userId}).populate(relations.getAll);
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async create(req, res) {
        try {
            const user = await checkUserAccess(req)

            const item = await new Exercise({...req.body, user: user.userId});
            await item.save();
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async update(req, res) {
        try {
            await checkUserAccess(req)

            const item = await Exercise.findByIdAndUpdate(req.body.id, req.body, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async delete(req, res) {
        try {
            await checkUserAccess(req)

            await Exercise.findByIdAndDelete(req.body.id);
            return res.status(200).send({message: 'Product is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

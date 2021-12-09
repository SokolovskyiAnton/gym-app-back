const {Exercise, User} = require('../models')
const jwt = require("jsonwebtoken");

const relations = {
    getAll: 'results',
    get: 'results'
}

module.exports = {
    async get({params: {id}}, res) {
        try {
            const item = await Exercise.findById(id).populate(relations.get);
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async getAll(req, res) {
        try {
            const { headers: { authorization } } = req;
            const token = authorization.split(' ')[1];
            const decodeUser = await jwt.decode(token, process.env.JWT_SECRET)

            const items = await Exercise.find({user: decodeUser.userId}).populate(relations.getAll);
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async create({body}, res) {
        try {
            const user = await User.findOne({_id: body.id})
            const item = await new Exercise({...body.data, user: user._id});
            await item.save();
            await User.findOneAndUpdate({_id: user._id}, {exercises: [...user.exercises, item]})
            return res.status(200).send({
                message: 'Success'
            });
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async update({params: {id}, body}, res) {
        try {
            const item = await Exercise.findByIdAndUpdate(id, body, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async delete({params: {id}}, res) {
        try {
            await Exercise.findByIdAndDelete(id);
            return res.status(200).send({status: 'Ok', message: 'Product is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}
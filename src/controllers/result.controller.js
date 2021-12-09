const {Result, Exercise} = require('../models')

const relations = {
    getAll: 'exercises',
    get: 'exercises'
}

module.exports = {
    async get({params: {id}}, res) {
        try {
            const item = await Result.findById(id).populate(relations.get);
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async getAll(_, res) {
        try {
            const items = await Result.find().populate(relations.getAll);
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async create({body}, res) {
        try {
            const item = await new Result(body.data);
            const newItem = await item.save();
            const findModel = await Exercise.findOne({_id: body.id});

            await Exercise.findOneAndUpdate({_id: body.id}, {results: [...findModel.results, newItem]}, {useFindAndModify: false})
            return res.status(200).send({
                message: 'Success'
            });
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async update({params: {id}, body}, res) {
        try {
            const item = await Result.findByIdAndUpdate(id, body, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async delete({params: {id}}, res) {
        try {
            await Result.findByIdAndDelete(id);
            return res.status(200).send({status: 'Ok', message: 'Product is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}
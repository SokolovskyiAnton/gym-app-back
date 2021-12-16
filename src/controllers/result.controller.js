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
    async create(req, res) {
        try {
            const item = await new Result(req.body.data);
            await item.save();
            const findModel = await Exercise.findOne({_id: req.body.id});

            await Exercise.findOneAndUpdate({_id: req.body.id}, {results: [...findModel.results, item]}, {useFindAndModify: false})
            return res.status(200).send({message: 'Product is created'});
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async update(req, res) {
        try {
            await Result.findByIdAndUpdate(req.body.id, req.body.data, {new: true});
            return res.status(200).send({message: 'Product is updated'});
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async delete(req, res) {
        try {
            await Result.findByIdAndDelete(req.body.id);
            return res.status(200).send({status: 'Ok', message: 'Product is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

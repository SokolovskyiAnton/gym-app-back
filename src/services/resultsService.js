const BasicSettings = require('./basicSettings');

class ResultsService extends BasicSettings {
    async get(req, res) {
        try {
            await this.checkUserAccess(req, res)
            const item = await this.models.Result.findById(req.query.id).populate('exercises');
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async getAll(req, res) {
        try {
            await this.checkUserAccess(req, res)

            const items = await this.models.Result.find().populate('exercises');
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async create(req, res) {
        try {
            await this.checkUserAccess(req, res)

            const item = await new this.models.Result(req.body.data);
            await item.save();
            const findModel = await this.models.Exercise.findOne({_id: req.body.id});

            await this.models.Exercise.findOneAndUpdate({_id: req.body.id}, {results: [...findModel.exercises, item]}, {useFindAndModify: false})
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async update(req, res) {
        try {
            await this.checkUserAccess(req, res)

            const item = await this.models.Result.findByIdAndUpdate(req.body.id, req.body.data, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async delete(req, res) {
        try {
            await this.checkUserAccess(req, res)

            await this.models.Result.findByIdAndDelete(req.body.id);
            return res.status(200).send({message: 'Result is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

module.exports = {ResultsService}

const BasicSettings = require('./basicSettings')

class ExerciseService extends BasicSettings {
    async get(req, res) {
        try {
            await this.checkUserAccess(req, res)
            const item = await this.models.Exercise.findById(req.query.id).populate('results');
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async getAll(req, res) {
        try {
            const decodeUser = await this.checkUserAccess(req, res)

            const items = await this.models.Exercise.find({user: decodeUser._id}).populate('results');
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async create(req, res) {
        try {
            const decodeUser = await this.checkUserAccess(req, res)

            const item = await new this.models.Exercise({...req.body.data, user: decodeUser._id});
            await item.save();
            const findModel = await this.models.Category.findOne({_id: req.body.id});

            await this.models.Category.findOneAndUpdate({_id: req.body.id}, {exercises: [...findModel.exercises, item]}, {useFindAndModify: false})
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async update(req, res) {
        try {
            await this.checkUserAccess(req, res)

            const item = await this.models.Exercise.findByIdAndUpdate(req.body.id, req.body, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async delete(req, res) {
        try {
            await this.checkUserAccess(req, res)

            await this.models.Exercise.findByIdAndDelete(req.body.id);
            return res.status(200).send({message: 'Exercise is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

module.exports = {ExerciseService}

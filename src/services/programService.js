const BasicSettings = require('./basicSettings')

class ProgramService extends BasicSettings {
    async getAll(req, res) {
        try {
            const decodeUser = await this.checkUserAccess(req, res)
            const items = await this.models.Program.find().populate({
                match: { user: decodeUser._id },
                path: 'exercises',
                populate: 'results'
            });
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async create(req, res) {
        try {
            const item = await new this.models.Program({...req.body});
            await item.save();
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async delete(req, res) {
        try {
            await this.checkUserAccess(req, res)

            await this.models.Program.findByIdAndDelete(req.body._id);
            return res.status(200).send({message: 'Exercise is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async update(req, res) {
        try {
            await this.checkUserAccess(req, res)

            const item = await this.models.Program.findByIdAndUpdate(req.body._id, req.body, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

module.exports = {ProgramService}

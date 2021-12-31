const BasicSettings = require('./basicSettings')

class CategoryService extends BasicSettings {
    async getAll(req, res) {
        try {
            const decodeUser = await this.checkUserAccess(req, res)
            const items = await this.models.Category.find().populate({
                path: 'exercises',
                match: { user: decodeUser._id},
                populate: 'results'
            });
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async create(req, res) {
        try {
            const item = await new this.models.Category({...req.body});
            await item.save();
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

module.exports = {CategoryService}

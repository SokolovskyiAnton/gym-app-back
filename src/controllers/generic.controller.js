const genericCrud = (model, relations = {}) => ({
    async get({params: {id}}, res) {
        try {
            const item = await model.findById(id).populate(relations.get);
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async getAll(_, res) {
        try {
            const items = await model.find().populate(relations.getAll);
            return res.status(200).send(items);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async create({body}, res) {
        try {
            const item = new model(body);
            const newItem = await item.save();
            return res.status(200).send(newItem);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async update({params: {id}, body}, res) {
        try {
            const item = await model.findByIdAndUpdate(id, body, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async delete({params: {id}}, res) {
        try {
            await model.findByIdAndDelete(id);
            return res.status(200).send({status: 'Ok', message: 'Product is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
});

module.exports = genericCrud
const BasicSettings = require('./basicSettings')

class CalendarService extends BasicSettings {
    async getAll(req, res) {
        try {
            const decodeUser = await this.checkUserAccess(req, res)

            const programs = await this.models.Calendar.find().populate({
                match: { user: decodeUser._id },
                path: 'program',
                populate: {
                    path: 'exercises',
                    populate: 'results'
                }
            });
            const events = programs.map(program => program.date)
            return res.status(200).send({
                events,
                programs
            });
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async create(req, res) {
        try {
            const item = await new this.models.Calendar({...req.body});
            await item.save();
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async delete(req, res) {
        try {
            await this.checkUserAccess(req, res)

            await this.models.Calendar.findByIdAndDelete(req.body._id);
            return res.status(200).send({message: 'Exercise is deleted'});
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    async update(req, res) {
        try {
            await this.checkUserAccess(req, res)

            const item = await this.models.Calendar.findByIdAndUpdate(req.body._id, req.body, {new: true});
            return res.status(200).send(item);
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

module.exports = {CalendarService}

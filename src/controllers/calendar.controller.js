const {CalendarService} = require('../services/calendarService')
const Calendar = new CalendarService()
module.exports = {
    async getAll(req, res) {
        await Calendar.getAll(req, res)
    },
    async create(req, res) {
        await Calendar.create(req, res)
    },
    async delete(req, res) {
        await Calendar.delete(req, res)
    },
    async update(req, res) {
        await Calendar.update(req, res)
    }
}

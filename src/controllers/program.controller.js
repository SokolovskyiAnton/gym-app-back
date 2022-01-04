const {ProgramService} = require('../services/programService')
const Program = new ProgramService()
module.exports = {
    async getAll(req, res) {
        await Program.getAll(req, res)
    },
    async create(req, res) {
        await Program.create(req, res)
    },
    async delete(req, res) {
        await Program.delete(req, res)
    },
    async update(req, res) {
        await Program.update(req, res)
    }
}

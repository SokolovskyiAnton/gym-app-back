const {ResultsService} = require('../services/resultsService')
const Result = new ResultsService()

module.exports = {
    async get(req, res) {
        await Result.get(req, res)
    },
    async getAll(req, res) {
        await Result.getAll(req, res)
    },
    async create(req, res) {
        await Result.create(req, res)
    },
    async update(req, res) {
        await Result.update(req, res)
    },
    async delete(req, res) {
        await Result.delete(req, res)
    }
}

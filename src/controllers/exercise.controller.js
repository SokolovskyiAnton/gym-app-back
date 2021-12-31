const {ExerciseService} = require('../services/exerciseService')
const Exercise = new ExerciseService()

module.exports = {
    async get(req, res) {
        await Exercise.get(req, res)
    },
    async getAll(req, res) {
        await Exercise.getAll(req, res)
    },
    async create(req, res) {
        await Exercise.create(req, res)
    },
    async update(req, res) {
        await Exercise.update(req, res)
    },
    async delete(req, res) {
        await Exercise.delete(req, res)
    }
}

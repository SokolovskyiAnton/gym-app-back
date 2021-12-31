const {CategoryService} = require('../services/categoryService')
const Category = new CategoryService()
module.exports = {
    async getAll(req, res) {
        await Category.getAll(req, res)
    },
    async create(req, res) {
        await Category.create(req, res)
    }
}

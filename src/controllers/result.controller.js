const genericCrud = require('./generic.controller');
const {Result} = require('../models')

const relations = {
    getAll: 'exercises',
    get: 'exercises'
}

module.exports = {
    ...genericCrud(Result, relations)
}
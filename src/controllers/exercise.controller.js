const genericCrud = require('./generic.controller');
const {Exercise} = require('../models')

const relations = {
    getAll: 'results',
    get: 'results'
}

module.exports = {
    ...genericCrud(Exercise, relations)
}
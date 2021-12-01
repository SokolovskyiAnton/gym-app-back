const genericCrud = require('./generic.controller');
const {Result} = require('../models')

module.exports = {
    ...genericCrud(Result)
}
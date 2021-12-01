const genericCrud = require('./generic.controller');
const {Exercise} = require('../models')

module.exports = {
    ...genericCrud(Exercise)
}
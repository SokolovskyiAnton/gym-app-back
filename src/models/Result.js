const {model, Schema} = require('mongoose');

const schema = new Schema({
    date: {
        type: String,
        default: ''
    },
    quantity: {}
})

module.exports = model('Result', schema);
const {model, Schema} = require('mongoose');
const mongoose = require('mongoose');
const schema = new Schema({
    date: {
        type: String,
        default: ''
    },
    quantity: {},
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
    }
})

module.exports = model('Result', schema);
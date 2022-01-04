const {model, Schema} = require('mongoose');
const mongoose = require("mongoose");

const schema = new Schema({
    date: {
        type: String,
        default: ''
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Calendar', schema);

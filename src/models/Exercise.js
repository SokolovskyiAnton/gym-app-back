const {model, Schema} = require('mongoose');
const mongoose = require("mongoose");

const schema = new Schema({
    title: {
        type: String,
        default: ''
    },
    results: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Result'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Exercise', schema);
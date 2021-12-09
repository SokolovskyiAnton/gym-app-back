const {model, Schema} = require('mongoose');
const mongoose = require("mongoose");

const schema = new Schema({
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    },
    verifyAt: {
        type: String,
        default: ''
    },
    exercises: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise'
        }
    ]
})

module.exports = model('User', schema);
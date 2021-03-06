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
    confirmEmail: {
        type: String,
        default: ''
    },
    resetPassword: {
        type: String,
        default: ''
    },
    verifyAt: {
        type: String,
        default: ''
    }
})

module.exports = model('User', schema);

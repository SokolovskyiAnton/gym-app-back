const {model, Schema} = require('mongoose');
const mongoose = require("mongoose");

const schema = new Schema({
    token: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Token', schema);
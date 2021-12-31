const {model, Schema} = require('mongoose');
const mongoose = require("mongoose");

const schema = new Schema({
    title: {
        type: String,
        default: ''
    },
    exercises: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise'
        }
    ],
    svg: {
        type: String,
        default: ''
    },
    isTimer: {
        type: Boolean,
        default: false
    }
})

module.exports = model('Category', schema);

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
    color: {
      type: String,
      default: 'blue'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Program', schema);

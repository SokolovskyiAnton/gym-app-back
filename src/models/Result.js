const {model, Schema} = require('mongoose');
const schema = new Schema({
    date: {
        type: String,
        default: ''
    },
    results: [
        {
            weight: {
                type: String,
                default: ''
            },
            repetition: {
                type: String,
                default: ''
            },
            duration: {
                type: String,
                default: ''
            },
            distance: {
                type: String,
                default: ''
            }
        }
    ]
})

module.exports = model('Result', schema);

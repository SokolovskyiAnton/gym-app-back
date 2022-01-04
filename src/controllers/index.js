const auth = require('./auth.controller');
const exercise = require('./exercise.controller');
const result = require('./result.controller')
const category = require('./category.controller')
const calendar = require('./calendar.controller')
const program = require('./program.controller')

module.exports = {
    auth,
    exercise,
    result,
    category,
    calendar,
    program
}

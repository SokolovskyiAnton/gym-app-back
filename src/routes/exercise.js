const router = require('express-promise-router')()

const {exercise} = require('../controllers')

router.route('/:id').get(exercise.get)
router.route('/').post(exercise.create)
router.route('/').get(exercise.getAll)
router.route('/:id').put(exercise.update)
router.route('/:id').delete(exercise.delete)

module.exports = router;
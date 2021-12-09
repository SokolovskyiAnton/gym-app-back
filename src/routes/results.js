const router = require('express-promise-router')()

const {result} = require('../controllers')

router.route('/').post(result.create)
router.route('/').get(result.getAll)
router.route('/:id').get(result.get)
router.route('/:id').put(result.update)
router.route('/:id').delete(result.delete)

module.exports = router;
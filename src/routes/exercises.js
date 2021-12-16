const router = require('express-promise-router')()
const {checkJwtToken} = require('../middlewares/checkJWT.middleware')
const { exercise } = require('../controllers')

router.route('/').get(checkJwtToken, exercise.getAll)
router.route('/').post(checkJwtToken, exercise.create)
router.route('/exercise').get(checkJwtToken, exercise.get)
router.route('/').put(checkJwtToken, exercise.update)
router.route('/').delete(checkJwtToken, exercise.delete)

module.exports = router;

const router = require('express-promise-router')()
const {checkJwtToken} = require('../middlewares/checkJWT.middleware')
const {result} = require('../controllers')

router.route('/').post(checkJwtToken, result.create)
router.route('/').get(checkJwtToken, result.getAll)
router.route('/:id').get(checkJwtToken, result.get)
router.route('/').put(checkJwtToken, result.update)
router.route('/').delete(checkJwtToken, result.delete)

module.exports = router;

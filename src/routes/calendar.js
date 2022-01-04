const router = require('express-promise-router')()
const {checkJwtToken} = require('../middlewares/checkJWT.middleware')
const { calendar } = require('../controllers')

router.route('/').get(checkJwtToken, calendar.getAll)
router.route('/').post(checkJwtToken, calendar.create)
router.route('/').put(checkJwtToken, calendar.update)
router.route('/').delete(checkJwtToken, calendar.delete)

module.exports = router;

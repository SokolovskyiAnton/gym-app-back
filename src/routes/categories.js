const router = require('express-promise-router')()
const {checkJwtToken} = require('../middlewares/checkJWT.middleware')
const { category } = require('../controllers')

router.route('/').get(checkJwtToken, category.getAll)
router.route('/').post(checkJwtToken, category.create)

module.exports = router;

const router = require('express-promise-router')()
const {checkJwtToken} = require('../middlewares/checkJWT.middleware')
const { program } = require('../controllers')

router.route('/').get(checkJwtToken, program.getAll)
router.route('/').post(checkJwtToken, program.create)
router.route('/').put(checkJwtToken, program.update)
router.route('/').delete(checkJwtToken, program.delete)

module.exports = router;

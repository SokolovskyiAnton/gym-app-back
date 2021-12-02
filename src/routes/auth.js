const router = require('express-promise-router')()

const {auth} = require('../controllers')

router.route('/login').post(auth.login)
router.route('/signup').post(auth.signUp)
router.route('/logout').post(auth.logout)
router.route('/refresh').post(auth.refreshToken)

module.exports = router;
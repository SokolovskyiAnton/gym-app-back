const router = require('express-promise-router')()

const {auth} = require('../controllers')

router.route('/login').post(auth.login)
router.route('/signup').post(auth.signUp)
router.route('/logout').post(auth.logout)
router.route('/refresh').post(auth.refreshToken)
router.route('/forgot-password').post(auth.forgotPassword)
router.route('/reset-password').post(auth.resetPassword)
router.route('/verify/:token').get(auth.verifyEmail)

module.exports = router;

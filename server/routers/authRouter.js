const router = require('express').Router()
const authController = require('../controllers/authController')

router.post('/signUp',authController.signUpController)
router.post('/login',authController.loginController)
router.post('/logout',authController.logoutController)
router.get('/refresh',authController.refreshAccessTokencontroller)


module.exports = router

const router = require('express').Router()
const demoController = require('../controllers/demo')

router.get('/demo',demoController.demoController)


module.exports = router

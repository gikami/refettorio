const Router = require('express')
const router = new Router()
const webhookController = require('../controllers/webhookController')

router.all('/', webhookController.webhook)

module.exports = router

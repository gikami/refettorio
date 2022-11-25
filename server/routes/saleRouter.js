const Router = require('express')
const router = new Router()
const saleController = require('../controllers/saleController')

router.get('/', saleController.getAll)
router.get('/:id', saleController.getOne)

module.exports = router

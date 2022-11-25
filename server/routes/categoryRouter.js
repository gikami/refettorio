const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/categoryController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)

module.exports = router

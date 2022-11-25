const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/createReview', productController.createReview)
router.post('/getrecommend', productController.getRecommend)
router.post('/', productController.getAll)
router.get('/:id', productController.getOne)

module.exports = router

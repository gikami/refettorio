const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/getAikoStreets', authMiddleware, adminController.getAikoStreets)
router.get('/getAikoCategories', authMiddleware, adminController.getAikoCategories)
router.get('/getAikoProducts', authMiddleware, adminController.getAikoProducts)
router.post('/sendAikoOrder', authMiddleware, adminController.sendAikoOrder)

router.post('/createUser', checkRole('ADMIN'), adminController.createUser)
router.post('/editUser', checkRole('ADMIN'), adminController.editUser)
router.post('/deleteUser', checkRole('ADMIN'), adminController.deleteUser)
router.get('/getUser', adminController.getUser)
router.get('/getUsers', adminController.getUsers)

router.post('/createCategory', checkRole('ADMIN'), adminController.createCategory)
router.post('/editCategory', checkRole('ADMIN'), adminController.editCategory)
router.post('/deleteCategory', checkRole('ADMIN'), adminController.deleteCategory)
router.get('/getCategory', adminController.getCategory)
router.get('/getCategories', adminController.getCategories)

router.post('/createProduct', checkRole('ADMIN'), adminController.createProduct)
router.post('/editProduct', checkRole('ADMIN'), adminController.editProduct)
router.post('/deleteProduct', checkRole('ADMIN'), adminController.deleteProduct)
router.get('/getProduct', adminController.getProduct)
router.get('/getProducts', adminController.getProducts)

router.post('/createSale', checkRole('ADMIN'), adminController.createSale)
router.post('/editSale', checkRole('ADMIN'), adminController.editSale)
router.post('/deleteSale', checkRole('ADMIN'), adminController.deleteSale)
router.get('/getSale', adminController.getSale)
router.get('/getSales', adminController.getSales)

router.post('/createOrder', checkRole('ADMIN'), adminController.createOrder)
router.post('/editOrder', checkRole('ADMIN'), adminController.editOrder)
router.post('/deleteOrder', checkRole('ADMIN'), adminController.deleteOrder)
router.get('/getOrder', adminController.getOrder)
router.get('/getOrders', adminController.getOrders)

router.post('/sendPush', checkRole('ADMIN'), adminController.sendPush)

module.exports = router

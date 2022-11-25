const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/newpassword', userController.newPassword)
router.post('/login', userController.login)
router.post('/deleteAccount', authMiddleware, userController.deleteAccount)
router.post('/getAllPoints', authMiddleware, userController.getAllPoints)
router.post('/address', authMiddleware, userController.addAddress)
router.post('/getAllAddress', authMiddleware, userController.getAllAddress)
router.post('/getAllNotifications', authMiddleware, userController.getAllNotifications)
router.post('/deleteNotification', authMiddleware, userController.deleteNotification)
router.post('/editaddress', authMiddleware, userController.editAddress)
router.post('/deleteaddress', authMiddleware, userController.deleteAddress)
router.post('/edit', authMiddleware, userController.edit)
router.all('/auth', authMiddleware, userController.check)
router.post('/updatePoint', authMiddleware, userController.updatePoint)


module.exports = router

const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const saleRouter = require('./saleRouter')
const orderRouter = require('./orderRouter')
const adminRouter = require('./adminRouter')
const webhookRouter = require('./webhookRouter')

router.use('/user', userRouter)
router.use('/category', categoryRouter)
router.use('/sale', saleRouter)
router.use('/product', productRouter)
router.use('/order', orderRouter)
router.use('/admin', adminRouter)
router.use('/webhook', webhookRouter)

module.exports = router

const Aiko = require('../components/aikoTransport')
const uuid = require('uuid')
const path = require('path')
const { unlink } = require('fs')
const { Product, Category, User, Order, Sale, Notification } = require('../models/models')
const ApiError = require('../error/ApiError')
const NotificationsPush = require('../components/pushNotifications')

class AdminController {

    async getAikoCompany(req, res, next) {
        try {
            let data = await Aiko.getCompany()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async getAikoStreets(req, res, next) {
        try {
            let data = await Aiko.getStreets()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async getAikoCategories(req, res, next) {
        try {
            let data = await Aiko.getCategories()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async getAikoProducts(req, res, next) {
        try {
            let data = await Aiko.getProducts()
            return res.json(data)
        } catch (error) {
            return res.json(error)
        }
    }
    async sendAikoOrder(req, res, next) {
        try {
            let result = await Aiko.sendOrder()
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    }

    async getCategories(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let categories = await Category.findAndCountAll({ order: [['priority', 'ASC']], limit, offset })
        return res.json(categories)
    }
    async getCategory(req, res) {
        let { id } = req.query
        let category = await Category.findOne({ where: { id } })
        return res.json({ category })
    }
    async createCategory(req, res) {
        const data = req.body
        const category = await Category.create(data)
        return res.json(category)
    }
    async deleteCategory(req, res) {
        let data = req.body
        const category = await Category.findOne({ where: { id: data.id } })
        if (!category) {
            return next(ApiError.internal('Такой категории не существует'))
        }
        await category.destroy()

        return res.json(true)
    }
    async editCategory(req, res) {
        const data = req.body
        let category = await Category.findOne({ where: { id: data.id } })
        if (!category) {
            return next(ApiError.internal('Такой категории не существует'))
        }
        await category.update(data)
        await category.save()

        return res.json(category)
    }

    async getProducts(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let products = await Product.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(products)
    }
    async getProduct(req, res) {
        let { id } = req.query
        let product = await Product.findOne({ where: { id } })
        return res.json({ product })
    }
    async createProduct(req, res, next) {
        const data = req.body

        if (data) {
            const { image } = req.files
            const product = await Product.create(data)
            if (image) {
                let fileName = uuid.v4() + ".jpg"
                image.mv(path.resolve(__dirname, '..', 'static/products', fileName))
                product.update({ image: fileName })
                product.save()
            }
            return res.json(product)
        } else {
            return next(ApiError.internal('Заполнены не все поля'))
        }
    }
    async deleteProduct(req, res) {
        let data = req.body
        const product = await Product.findOne({ where: { id: data.id } })
        if (!product) {
            return next(ApiError.internal('Такого товара не существует'))
        }
        await product.destroy()

        return res.json(true)
    }
    async editProduct(req, res) {
        const data = req.body
        const file = req.files

        const product = await Product.findOne({ where: { id: data.id } })
        if (!product) {
            return next(ApiError.internal('Такого товара не существует'))
        }
        await product.update(data)
        await product.save()
        if (file && file.image) {
            if (product.image) {
                unlink('static/products/' + product.image, (err) => {
                    if (err) throw err
                })
            }
            let fileName = uuid.v4() + ".jpg"
            file.image.mv(path.resolve(__dirname, '..', 'static/products', fileName))

            await product.update({ image: fileName })
            await product.save()
        }
        return res.json(product)
    }




    async getSales(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let sales = await Sale.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(sales)
    }
    async getSale(req, res) {
        let { id } = req.query
        let sale = await Sale.findOne({ where: { id } })
        return res.json({ sale })
    }
    async createSale(req, res, next) {
        const data = req.body
        const { image } = req.files
        const sale = await Sale.create(data)
        if (image) {
            let fileName = uuid.v4() + ".jpg"
            image.mv(path.resolve(__dirname, '..', 'static/sale', fileName))
            sale.update({ image: fileName })
            sale.save()
        }
        return res.json(sale)
    }
    async deleteSale(req, res) {
        let data = req.body
        const sale = await Sale.findOne({ where: { id: data.id } })
        if (!sale) {
            return next(ApiError.internal('Такой акции не существует'))
        }
        await sale.destroy()

        return res.json(true)
    }
    async editSale(req, res) {
        const data = req.body
        const file = req.files

        const sale = await Sale.findOne({ where: { id: data.id } })
        if (!sale) {
            return next(ApiError.internal('Такой акции не существует'))
        }
        await sale.update(data)
        await sale.save()
        if (file && file.image) {
            if (sale.image) {
                unlink('static/sale/' + sale.image, (err) => {
                    if (err) throw err
                })
            }
            let fileName = uuid.v4() + ".jpg"
            file.image.mv(path.resolve(__dirname, '..', 'static/sale', fileName))

            await sale.update({ image: fileName })
            await sale.save()
        }
        return res.json(sale)
    }




    async getOrders(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let orders = await Order.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(orders)
    }
    async getOrder(req, res) {
        let { id } = req.query
        let order = await Order.findOne({ where: { id } })
        return res.json({ order })
    }
    async createOrder(req, res, next) {
        let { name, price, category, sale } = req.body
        const { image } = req.files
        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, '..', 'static', fileName))
        const order = await Order.create({ name, price, sale, category, image: fileName })
        return res.json(order)
    }
    async deleteOrder(req, res) {
        let data = req.body
        const order = await Order.findOne({ where: { id: data.id } })
        if (!order) {
            return next(ApiError.internal('Такого заказа не существует'))
        }
        await order.destroy()

        return res.json(true)
    }
    async editOrder(req, res) {
        const data = req.body
        let order = await Order.findOne({ where: { id: data.id } })
        if (!order) {
            return next(ApiError.internal('Такого заказа не существует'))
        }
        await order.update(data)
        await order.save()
        return res.json(order)
    }



    async getUsers(req, res) {
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 30
        let offset = page * limit - limit
        let users = await User.findAndCountAll({ order: [['id', 'ASC']], limit, offset })
        return res.json(users)
    }
    async getUser(req, res) {
        let { id } = req.query
        let user = await User.findOne({ where: { id } })
        return res.json({ user })
    }
    async createUser(req, res, next) {
        let { name, price, category, sale } = req.body
        const { image } = req.files
        let fileName = uuid.v4() + ".jpg"
        image.mv(path.resolve(__dirname, '..', 'static', fileName))
        const user = await User.create({ name, price, sale, category, image: fileName })
        return res.json(user)
    }
    async deleteUser(req, res) {
        let data = req.body
        const user = await User.findOne({ where: { id: data.id } })
        if (!user) {
            return next(ApiError.internal('Такого пользователя не существует'))
        }
        await user.destroy()

        return res.json(true)
    }
    async editUser(req, res) {
        var data = req.body
        const user = await User.findOne({ where: { id: data.id } })

        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        if (data.phone) {
            data.phone = data.phone.replace(/[^\d]/g, '')
        }
        await user.update(data)
        await user.save()

        return res.json(user)
    }

    async sendPush(req, res, next) {
        const { id, email, phone, token, all = false, title, text, params } = req.body

        if ((id || email || phone) && title && text) {
            var user = false;
            if (id) {
                user = await User.findOne({ where: { id: id } });
            } else if (email) {
                user = await User.findOne({ where: { email: email } });
            } else if (phone) {
                user = await User.findOne({ where: { phone: phone.replace(/[^\d]/g, '') } });
            } else if (token) {
                user = await User.findOne({ where: { push_token: token } });
            }
            if (user && user.id && user.push_token) {
                await NotificationsPush.send(text,
                    params ?? { name: 'Home' },
                    [user.push_token]
                );
                await Notification.create({
                    userId: user.id,
                    title: title,
                    desc: text,
                    params: params ? JSON.stringify(params) : JSON.stringify({ name: 'Home' }),
                });
                console.log('Push отправлен пользователю id' + id)
                return res.json('Push отправлен пользователю id' + id)
            }
        } else if (all && title && text) {
            const users = await User.findAll();
            if (users) {
                await NotificationsPush.send(text,
                    params ?? { name: 'Home' },
                    users.map(e => e.push_token)
                );
                users.map(async e =>
                    await Notification.create({
                        userId: e.id,
                        title: title,
                        desc: text,
                        params: params ? JSON.stringify(params) : JSON.stringify({ name: 'Home' }),
                    }));
                console.log('Push отправлен ' + users.length + ' пользователям')
                return res.json('Push отправлен ' + users.length + ' пользователям')
            }
        } else {
            return next(ApiError.internal('Заполнены не все поля'))
        }
    }
}

module.exports = new AdminController()

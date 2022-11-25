const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
var querystring = require('querystring')
const { User, Address, Order, Notification, Point } = require('../models/models')
const Aiko = require('../components/aikoTransport')

const generateJwt = (user, address = false, order = false) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            password: user.password,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            birthday_day: user.birthday_day,
            birthday_month: user.birthday_month,
            sex: user.sex,
            point: user.point,
            date: user.date,
            status: user.status,
            role: user.role,
            address: address,
            order: order,
            pushtoken: user.push_token,
        },
        process.env.SECRET_KEY,
        { expiresIn: '365d' }
    )
}
const sendSms = async (phone, text) => {
    if (text.length > 0 && phone.length > 10) {
        var from = 'Refettorio'
        var apikey = '23G9SX6J66LVD52L76434TZ3DBI56NR9RXNY1IPCE4M0S5KNCBUG280687T9B6ZD'
        const url = [
            'https://smspilot.ru/api.php',
            '?send=' + querystring.escape(text),
            '&to=' + phone,
            '&from=' + from,
            '&apikey=' + apikey,
            '&format=json'
        ].join('')

        let info = await axios({
            method: 'get',
            url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        if (info && info.data) {
            return info.data
        }
    } else {
        return false
    }
}

class UserController {
    async registration(req, res, next) {

        var { phone } = req.body

        if (!phone && phone.length < 10) {
            return next(ApiError.badRequest('Введите номер телефона'))
        }
        phone = phone.replace(/[^\d]/g, '')

        const user = await User.findOne({ where: { phone } })

        if (user) {
            return next(ApiError.badRequest('Пользователь с таким номером уже существует'))
        }

        var chars = "0123456789abcdefghijklmnopqrstuvwxyz"
        var passwordLength = 5
        var password = ""

        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length)
            password += chars.substring(randomNumber, randomNumber + 1)
        }

        const heshPassword = await bcrypt.hash(password, 5)

        let sms = await sendSms(phone, 'Ваш пароль ' + password + ' от профиля Refettorio');
        if (sms && !sms.error) {
            const getUser = await User.create({ phone, password: heshPassword })
            if (getUser) {
                let userData = await Aiko.createUser({ phone: phone });
                if (userData && userData.status && userData.data) {
                    await user.update({ apiId: userData.userAll.id, point: userData.data.balance })
                    await user.save()
                }
                const token = generateJwt(getUser)

                return res.json(token)
            } else {
                next(ApiError.internal("Ошибка при создании пользователя"))
            }
        } else {
            next(ApiError.internal(sms.error.description_ru))
        }
    }
    async newPassword(req, res, next) {
        try {
            console.log(req.body)
            var { phone } = req.body

            if (!phone && phone.length < 10) {
                return next(ApiError.badRequest('Введите номер телефона'))
            }
            phone = phone.replace(/[^\d]/g, '')

            const user = await User.findOne({ where: { phone } })

            if (!user) {
                return next(ApiError.badRequest('Пользователя с таким номером не существует'))
            }

            var chars = "0123456789abcdefghijklmnopqrstuvwxyz"
            var passwordLength = 5
            var password = ""

            for (var i = 0; i <= passwordLength; i++) {
                var randomNumber = Math.floor(Math.random() * chars.length)
                password += chars.substring(randomNumber, randomNumber + 1)
            }

            const heshPassword = await bcrypt.hash(password, 5)

            await user.update({ password: heshPassword })
            await user.save()

            sendSms(phone, 'Ваш новый пароль ' + password + ' от профиля Refettorio')

            return res.json(true)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async addAddress(req, res, next) {
        try {
            let { name, full, street, home, floor, apartment, entrance, code } = req.body
            await Address.create({ user: req.user.id, name, full, street, home, floor, apartment, entrance, code });
            const addressAll = await Address.findAll({ where: { user: req.user.id } })
            const token = generateJwt(req.user, addressAll)
            return res.json({ token })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async editAddress(req, res, next) {
        try {
            let data = req.body
            const address = await Address.findOne({ where: { id: data.id, user: req.user.id } })
            if (!address) {
                return next(ApiError.internal('Такого адреса нет'))
            }
            await address.update(data)
            await address.save()
            const addressAll = await Address.findAll({ where: { user: req.user.id } })
            const token = generateJwt(req.user, addressAll)
            return res.json({ token })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteAddress(req, res, next) {
        try {
            let data = req.body
            const address = await Address.findOne({ where: { id: data.id, user: req.user.id } })
            if (!address) {
                return next(ApiError.internal('Такого адреса нет'))
            }
            await address.destroy();
            const addressAll = await Address.findAll({ where: { user: req.user.id } })
            const token = generateJwt(req.user, addressAll)
            return res.json({ token })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async login(req, res, next) {
        console.log(req.body)
        var { phone, password } = req.body
        if (!phone || !password) {
            return next(ApiError.internal('Введите номер телефона и пароль'))
        }
        phone = phone.replace(/[^\d]/g, '')
        const user = await User.findOne({ where: { phone } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        if (!user.apiId) {
            let userData = await Aiko.getUser(user.phone)
            if (userData && userData.status && userData.data) {
                await user.update({ apiId: userData.userAll.id, point: userData.data.balance })
                await user.save()
            }
        }
        const address = await Address.findAll({ where: { user: user.id } })
        const token = generateJwt(user, (address) ? address : false)
        return res.json({ token })
    }
    async edit(req, res, next) {
        try {
            var data = req.body
            const user = await User.findOne({ where: { id: data.id, password: data.password } })

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            if (data.phone) {
                data.phone = data.phone.replace(/[^\d]/g, '')
            }
            if (data.pushToken) {
                data.push_token = data.pushToken
            }
            await user.update(data)
            await user.save()

            const address = await Address.findAll({ where: { user: user.id } })
            const token = generateJwt(user, address)
            return res.json({ token })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteAccount(req, res, next) {
        try {
            var data = req.body
            const user = await User.findOne({ where: { id: data.id, password: data.password } })

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            user.destroy();

            return res.json({ status: true })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async updatePoint(req, res) {
        const { id } = req.user
        const user = await User.findOne({ where: { id } })
        if (user) {
            let data = await Aiko.getUser(user.phone)
            if (data && data.status) {
                await User.update({ point: Number(data.data.balance) }, { where: { id: id } })
            }
            const address = await Address.findAll({ where: { user: user.id } })
            const token = generateJwt(user, address)
            return res.json({ token })
        }
    }
    async getAllPoints(req, res, next) {
        try {
            const { user } = req.body
            let userData = await User.findOne({ where: { id: user } })
            if (!userData) {
                return next(ApiError.internal('Пользователь не найдены'))
            }
            let data = await Aiko.getUser(userData.phone)
            if (data && data.status) {
                await User.update({ point: Number(data.data.balance) }, { where: { id: user } })
                userData.point = Number(data.data.balance) ?? user.point
            }
            const address = await Address.findAll({ where: { user: user } })
            const token = generateJwt(userData, address)
            const points = await Point.findAll({ where: { userId: user }, order: [['id', 'DESC']] })

            return res.json({ status: true, token, points })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAllAddress(req, res, next) {
        try {
            const { user } = req.body
            const data = await Address.findAll({ where: { user }, order: [['id', 'DESC']] })

            if (!data) {
                return next(ApiError.internal('Адреса не найдены'))
            }

            return res.json({ status: true, data })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAllNotifications(req, res, next) {
        try {
            const { userId } = req.body
            const data = await Notification.findAll({ where: { userId }, order: [['id', 'DESC']] })

            if (!data) {
                return next(ApiError.internal('Уведомлений нет'))
            }

            return res.json({ status: true, data })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteNotification(req, res, next) {
        try {
            var data = req.body
            const notification = await Notification.findOne({ where: { id: data.id, userId: data.userId } })

            if (!notification) {
                return next(ApiError.internal('Уведомление не найдено'))
            }
            notification.destroy();

            return res.json({ status: true })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async check(req, res) {
        const { id } = req.user
        const address = await Address.findAll({ where: { user: id } })
        const order = await Order.findOne({ where: { user: id } })
        const token = generateJwt(req.user, (address) ? address : false, (order) ? order : false)
        return res.json({ token })
    }
}

module.exports = new UserController()

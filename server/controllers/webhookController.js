const { Point, User } = require('../models/models')
const ApiError = require('../error/ApiError');

class WebhookController {
    async webhook(req, res) {
        let data = req.body
        console.log(data)
        if (data && data.customerId) {
            let user = await User.findOne({ where: { apiId: data.customerId } })
            let desc = ''
            if (user && user.id) {
                if (data.balance) {
                    user.update({ point: data.balance })
                    user.save()
                }
                if (data.transactionType == 'WelcomeBonus') {
                    desc = 'Регистрация в Refettorio'
                } else if (data.transactionType == 'RefillWalletFromOrder') {
                    desc = 'Начисление баллов'
                } else if (data.transactionType == 'PayFromWallet') {
                    desc = 'Списание баллов'
                } else if (data.transactionType == 'CancelPayFromWallet') {
                    desc = 'Отмена заказа'
                } else if (data.transactionType == 'CancelRefillWalletFromOrder') {
                    desc = 'Отмена оплаты заказа'
                } else if (data.transactionType == 'SetGuestCategoryTransaction') {
                    desc = 'Баллы сгорели'
                }
                await Point.create({ userId: user.id, apiId: data.id, point: data.sum ?? 0, desc, type: data.transactionType, createdAt: data.changedOn })
            }
        }
        return res.json('OK')
    }
}

module.exports = new WebhookController()

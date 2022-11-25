const { Op, Address } = require('../database')
const ApiError = require('../error/ApiError')
const Pagination = require('../components/pagination')

class AddressController {
    async create(req, res, next) {
        try {
            const { id } = req.user
            var data = req.body
            if (!data) {
                throw next(ApiError.badRequest('Нет обязательных данных'))
            }
            data.userId = id
            const address = await Address.create(data)
            if (!address) {
                throw next(ApiError.internal('Ошибка при создании адреса'))
            }
            return res.json({ type: 'SUCCESS', address })
        } catch (err) {
            return next(ApiError.internal('ERROR', err?.message))
        }
    }
    async delete(req, res, next) {
        try {
            const { addressId } = req.body
            if (!addressId) {
                throw next(ApiError.badRequest('Нет id адреса'))
            }
            const address = await Address.findOne({ where: { id: addressId, userId: req.user.id } })
            if (!address) {
                return next(ApiError.internal('Такого адреса нет'))
            }
            await address.destroy()
            return res.json({ type: 'SUCCESS', status: true })
        } catch (err) {
            return next(ApiError.internal('ERROR', err?.message))
        }
    }
    async edit(req, res, next) {
        try {
            const data = req.body

            if (!data || !data.id) {
                throw next(ApiError.badRequest('Нет id адреса'))
            }

            const address = await Address.findOne({ where: { id: data.id, userId: req.user.id } })

            if (!address) {
                throw next(ApiError.internal('Адрес не найден'))
            }

            await address.update(data)
            await address.save()

            return res.json({ type: 'SUCCESS', address })
        } catch (err) {
            return next(ApiError.internal('ERROR', err?.message))
        }
    }
    async all(req, res, next) {
        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 30
            let offset = page * limit - limit

            const addresses = await Address.findAll({ where: { userId: req.user.id }, limit, offset })
            if (addresses) {
                const pagination = await Pagination.get(Address, { userId: req.user.id }, page, limit)
                return res.json({ type: 'SUCCESS', addresses, pagination })
            } else {
                next(ApiError.badRequest('Адреса не найдены'))
            }
        } catch (err) {
            return next(ApiError.internal('ERROR', err?.message))
        }
    }

    async one(req, res, next) {
        try {
            const { addressId } = req.query
            if (!addressId) {
                throw next(ApiError.badRequest('Нет id адреса'))
            }
            const address = await Address.findOne({ where: { id: addressId, userId: req.user.id } })
            if (!address) {
                throw next(ApiError.internal('Адрес не найден'))
            }
            return res.json({ type: 'SUCCESS', address })
        } catch (err) {
            return next(ApiError.internal('ERROR', err?.message))
        }
    }
}

module.exports = new AddressController()

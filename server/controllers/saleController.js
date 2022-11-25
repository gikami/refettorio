const { Sale } = require('../models/models')
const ApiError = require('../error/ApiError');

class SaleController {
    async getAll(req, res, next) {
        try {
            let sale = await Sale.findAll({ where: { status: 1 } })
            return res.json(sale)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req, res) {
        try {
            const { id } = req.params
            let sale = await Sale.findOne({ where: { id, status: 1 } })
            return res.json(sale)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new SaleController()

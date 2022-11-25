const { Op, Category } = require('../models/models')
const ApiError = require('../error/ApiError');

class CategoryController {
    async getAll(req, res, next) {
        try {
            var category = await Category.findAll({ where: { parentGroup: null, isGroupModifier: 0, status: 1 }, order: [['priority', 'ASC']] })
            let newCategory = await category.map(async item => {
                let subcategory = await Category.findAll({ where: { parentGroup: item.apiId, isGroupModifier: 0, status: 1 }, order: [['priority', 'ASC']] })
                if (subcategory) {
                    item.subcategory = subcategory
                }
                return item
            })
            category = await Promise.all(newCategory).then(res => res)

            return res.json({ category })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req, res, next){
        try {
            const { id } = req.params
            var category = await Category.findOne({ where: { id: id, status: 1 } })
 
            return res.json({ category })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new CategoryController()

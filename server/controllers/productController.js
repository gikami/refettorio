const uuid = require('uuid')
const path = require('path');
const { Op, Product, Review, User, Category } = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {

    async createReview(req, res, next) {
        try {
            let { rating, text, name, user, product } = req.body
            const infoReview = await Review.findOne({ where: { userId: user, product } })
            if (!infoReview) {
                const data = await Review.create({ rating, text, userId: user, name, product })
                return res.json(data.data)
            } else {
                return res.json('Вы уже опубликовали отзыв')
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let { categoryId, limit, page, filter } = req.body
            console.log()
            categoryId = categoryId ? categoryId : false
            page = page || 1
            limit = limit || 30
            let offset = page * limit - limit
            var products = []
            var category

            if (categoryId) {
                if (categoryId.subcategory && categoryId.subcategory.length > 0) {
                    category = await Category.findOne({ where: { id: categoryId.subcategory[0].id, status: 1 } })
                } else {
                    category = await Category.findOne({ where: { id: categoryId, status: 1 } })
                }
                if (category) {

                    if(filter && filter.length > 0){
                        products = await Product.findAll({ where: { parentGroup: category.apiId, type: 'dish', status: 1, filter: {[Op.like]: '%' + filter + '%'} }, order: [['price', 'ASC']] })  
                    }else{
                        products = await Product.findAll({ where: { parentGroup: category.apiId, type: 'dish', status: 1 }, order: [['price', 'ASC']], limit, offset })
                    }
                
                    if (products) {
                        products = await Promise.all(products).then(res => res)
                    }

                } else {
                    products = false
                }

                return res.json(products)

            } else {
                category = await Category.findAll({ where: { parentGroup: null, isGroupModifier: 0, status: 1 }, order: [['priority', 'ASC']] })
                if (category) {
                    products = category.map(async item => {
                        var rows = [];
                        let subcategoryData = await Category.findAll({ where: { parentGroup: item.apiId, isGroupModifier: 0, status: 1 }, order: [['priority', 'ASC']] })
                        if (subcategoryData) {
                            rows['subCategory'] = subcategoryData.map(async itemSubCategory => {
                                let subProductsData
                                if(filter && filter.length > 0){
                                    subProductsData = await Product.findAll({ where: { parentGroup: itemSubCategory.apiId, type: 'dish', status: 1, filter: {[Op.like]: '%' + filter + '%'} }, order: [['price', 'ASC']] })  
                                }else{
                                    subProductsData = await Product.findAll({ where: { parentGroup: itemSubCategory.apiId, type: 'dish', status: 1  }, order: [['price', 'ASC']] })
                                }

                                if (subProductsData) {
                                    var subProducts = { title: '', id: 0, products: '' };
                                    subProducts.id = itemSubCategory.id;
                                    subProducts.title = itemSubCategory.title;
                                    subProducts.products = await Promise.all(subProductsData).then(res => res);

                                    return subProducts;
                                }
                            })
                        }
                        let productsData
                        if(filter && filter.length > 0){
                            productsData = await Product.findAll({ where: { parentGroup: item.apiId, type: 'dish', status: 1, filter: {[Op.like]: '%' + filter + '%'} }, order: [['price', 'ASC']] })
                        }else{
                            productsData = await Product.findAll({ where: { parentGroup: item.apiId, type: 'dish', status: 1 }, order: [ ['price', 'ASC']] })
                        }
                        rows['products'] = productsData

                        let products = await Promise.all(rows['products']).then(res => res)
                        products = products.sort(function (a, b) {
                            return a.price - b.price;
                        })
                        let subProducts = await Promise.all(rows['subCategory']).then(res => res)
                        subProducts = subProducts.sort(function (a, b) {
                            return a.price - b.price;
                        })
                        return { item, products, subProducts }
                    })


                    let data = await Promise.all(products).then(res => res)

                    return res.json(data)
                }
            }

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getRecommend(req, res) {
        let { id } = req.query
        let recommend = await Product.findAll({ where: { recommend: (id) ? id : 1 } })
        return res.json({ recommend })
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params
            var product = await Product.findOne({ where: { id: id, type: 'dish', status: 1 } })
            let attribute = product.groupModifiers ? JSON.parse(product.groupModifiers) : false
            let attributeView = []
            if (attribute && attribute[0]) {
                let attr = await Product.findAll({ where: { groupId: attribute[0], type: 'modifier', status: 1 }, order: [['price', 'ASC']] })
                attributeView.push(attr)
            }
            // if (attribute && attribute[1]) {
            //     let attr = await Product.findAll({ where: { groupId: attribute[1], type: 'modifier', status: 1 }, order: [['price', 'ASC']] })
            //     attributeView.push(attr)
            //     // if (attr[0].weight) {
            //     //     product.weight = attr[0].weight
            //     // }
            // }

            if (attributeView) {
                product.attribute = attributeView
            }
            // if (product.price === 0 && attributeView[0]) {
            //     product.price = attributeView[0][0].price
            // }
            return res.json({ product })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProductController()

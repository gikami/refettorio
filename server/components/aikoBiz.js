const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { Category, Product } = require('../models/models')

class Aiko {
    constructor() {
        this.url = 'https://iiko.biz:9900/api/0/';
        this.aikoLogin = process.env.AIKO_LOGIN
        this.aikoPassword = process.env.AIKO_PASSWORD
        this.token = false
        this.auth()
    }
    async auth() {
        this.token = await axios.get(this.url + "auth/access_token?user_id=" + this.aikoLogin + "&user_secret=" + this.aikoPassword)
        if (!this.token) {
            return 'Ошибка при получении токена'
        }
        this.org = await axios.get(this.url + "organization/list?access_token=" + this.token.data)
        if (!this.org) {
            return 'Ошибка при получении организации'
        }
    }
    async uploadCategory() {
        const nomenclature = await axios.get(this.url + "nomenclature/" + this.org.data[0].id + "?access_token=" + this.token.data)
        if (!nomenclature) {
            return 'Ошибка при получении нуменклатуры'
        }
        let i = 1;
        await Category.destroy({ where: {}, truncate: true })
        await nomenclature.data.groups.map(item => {
            Category.create({
                api_id: item.id,
                title: item.name,
                priority: i++
            })
        })
        return true
    }
    async uploadProducts() {
        const nomenclature = await axios.get(this.url + "nomenclature/" + this.org.data[0].id + "?access_token=" + this.token.data)
        if (!nomenclature) {
            return 'Ошибка при получении нуменклатуры'
        }

        await Product.destroy({ where: {}, truncate: true })
        await nomenclature.data.products.map(async itemProduct => {
            if (itemProduct.images && itemProduct.images[0].imageUrl) {
                const fileUrl = itemProduct.images[0].imageUrl
                const fileName = path.basename(fileUrl)
                const localFilePath = path.resolve(__dirname, '..', 'static', fileName);
                await axios({
                    method: 'GET',
                    url: fileUrl,
                    responseType: 'stream'
                }).then(response => {
                    response.data.pipe(fs.createWriteStream(localFilePath));
                }).catch(error => {
                    console.log(error);
                })
                Product.create({
                    api_id: itemProduct.id,
                    title: (itemProduct.name) ? itemProduct.name : '',
                    description: (itemProduct.description) ? itemProduct.description : '',
                    price: (itemProduct.price) ? itemProduct.price : 0,
                    category: (itemProduct.parentGroup) ? itemProduct.parentGroup : itemProduct.groupId,
                    //category_modifier: (itemProduct.groupModifiers[0]) ? itemProduct.groupModifiers[0].modifierId : 0,
                    weight: (itemProduct.weight) ? itemProduct.weight : 0,
                    //type: itemProduct.type,
                    tags: JSON.stringify([
                        {
                            title: 'Жиры',
                            value: (itemProduct.fatFullAmount) ? itemProduct.fatFullAmount : 0
                        },
                        {
                            title: 'Белки',
                            value: (itemProduct.fiberFullAmount) ? itemProduct.fiberFullAmount : 0
                        },
                        {
                            title: 'Углеводы',
                            value: (itemProduct.carbohydrateFullAmount) ? itemProduct.carbohydrateFullAmount : 0
                        },
                        {
                            title: 'Калорийность',
                            value: (itemProduct.energyFullAmount) ? itemProduct.energyFullAmount : 0
                        }
                    ]),
                    image: (fileName && fileName.length > 0) ? fileName : ''
                })
            }
        })
        return true
    }
    async sendOrder(order) {
        if (!order) {
            return 'Нет данных о заказе'
        }
        const payment = await axios.get(this.url + "rmsSettings/getPaymentTypes?access_token=" + this.token.data + "&organization=" + this.org.data[0].id)
        if (!payment) {
            return 'Ошибка при получении типа оплаты'
        }
        let matches = payment.data.paymentTypes.filter(pay => pay.code === order.payment.toUpperCase() && pay);
        if (matches && matches[0]) {
            var productsData = []
            order.products.map(item => {
                productsData.push(
                    {
                        "id": item.api_id,
                        "name": item.title,
                        "amount": item.count,
                        "code": 31,
                        "sum": item.price,
                    }
                )
            })
            await axios.post(this.url + "orders/add?access_token=" + this.token.data + "&organization=" + this.org.data[0].id,
                JSON.stringify({
                    "organization": this.org.data[0].id,
                    "order": {
                        "phone": order.phone,
                        "isSelfService": false,
                        "address": {
                            "street": (order.street) ? order.street : 'ул 1 мая',
                            "home": (order.home) ? order.home : 5,
                            "apartment": order.apartment,
                            "comment": order.comment
                        },
                        //"date": order.date,
                        "personsCount": 1,
                        "items": productsData,
                        "paymentItems": [
                            {
                                "sum": order.total,
                                "paymentType": matches[0],
                                "isProcessedExternally": false,
                            }
                        ]
                    }
                }), {
                headers: {
                    'Content-Type': 'application/json',
                    "access_token": this.token.data,
                    "organization": this.org.data[0].id,
                }
            }).then(result => {
                console.log(result)
            }).catch(error => {
                console.log(error)
            })
        }
    }
}

module.exports = new Aiko()
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { Category, Product, City, Street, User } = require('../models/models')

class Aiko {
  constructor() {
    this.url = 'https://api-ru.iiko.services/api/1/'
    this.apiLogin = '935cc077'
  }
  async auth() {
    //Авторизация и получение (token)
    let token;
    let org;
    let header;

    await axios({
      method: 'post',
      url: this.url + 'access_token',
      data: {
        'apiLogin': this.apiLogin
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        token = response.data.token
      })
      .catch(error => {
        return { status: false, message: 'Ошибка нет ключа' }
      })

    header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
    //Получение данных организации (id)
    await axios({
      method: 'post',
      url: this.url + 'organizations',
      data: {
        'apiLogin': this.apiLogin
      },
      headers: header
    })
      .then(response => {
        org = response.data.organizations[0].id
      })
      .catch(error => {
        return { status: false, message: 'Ошибка нет данные организации или ключа' }
      })

    return { header, token, org }
  }
  async getStreets() {
    //Полученние списка городов (id)
    let config = await this.auth()
    let city
    let streets
    await axios({
      method: 'post',
      url: this.url + 'cities',
      data: {
        'organizationIds': [config.org]
      },
      headers: config.header
    })
      .then(response => {
        city = response.data.cities[0].items[0]
        if (!city) {
          return 'Ошибка при получении улиц'
        }
      })
      .catch(error => {
        return 'Ошибка при получении улиц'
      })

    //Получение улиц города
    await axios({
      method: 'post',
      url: this.url + 'streets/by_city',
      data: {
        'organizationId': config.org,
        'cityId': city.id
      },
      headers: config.header
    })
      .then(response => {
        streets = response.data.streets
        if (!streets) {
          return 'Ошибка при получении улиц'
        }
      })
      .catch(error => {
        return 'Ошибка при получении улиц'
      })

    City.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })
    Array(city).map(item => City.create({ apiId: item.id, title: item.name, classifierId: (item.classifierId) ? item.classifierId : '', externalRevision: (item.externalRevision) ? item.externalRevision : 0, status: (item.isDeleted) ? 0 : 1 }))
    Street.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })
    streets.map(item => !item.isDeleted && Street.create({ apiId: item.id, title: item.name, classifierId: (item.classifierId) ? item.classifierId : '', externalRevision: (item.externalRevision) ? item.externalRevision : 0, status: (item.isDeleted) ? 0 : 1 }))

    return { count: streets.length, city: streets }
  }
  async getCategories() {

    let config = await this.auth()
    let categories

    //Получение категорий
    await axios({
      method: 'post',
      url: this.url + 'nomenclature',
      data: {
        'organizationId': config.org
      },
      headers: config.header
    })
      .then(response => {
        categories = response.data.groups
      })

    if (!categories) {
      return 'Ошибка при получении категорий'
    }
    Category.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })
    categories.map((item, i) => {
      var fileName = false
      if (item.imageLinks && item.imageLinks[0]) {
        const fileUrl = item.imageLinks[0]
        fileName = path.basename(fileUrl)
        const localFilePath = path.resolve(__dirname, '..', 'static/category', fileName)
        axios({
          method: 'GET',
          url: fileUrl,
          responseType: 'stream'
        }).then(response => {
          response.data.pipe(fs.createWriteStream(localFilePath))
        })
      }
      Category.create({
        apiId: item.id,
        title: item.name.replace(/(<([^>]+)>)/ig, ''),
        priority: item.order,
        parentGroup: item.parentGroup,
        isGroupModifier: (item.isGroupModifier) ? 1 : 0,
        image: (fileName) ? fileName : '',
        status: (item.isDeleted) ? 0 : 1
      })
    })

    return { count: categories.length, categories: categories }
  }
  async getProducts() {

    let config = await this.auth()
    let products
    //Получение улиц города
    await axios({
      method: 'post',
      url: this.url + 'nomenclature',
      data: {
        'organizationId': config.org
      },
      headers: config.header
    })
      .then(response => {
        products = response.data.products
      })

    if (!products) {
      return 'Ошибка при получении товаров'
    }

    Product.destroy({ where: {}, truncate: true, cascade: false, restartIdentity: true })

    products.map(item => {
      if (item.type.toLowerCase() === 'dish') {
        var fileName = false
        if (item.imageLinks && item.imageLinks[0]) {
          const fileUrl = item.imageLinks[0]
          fileName = path.basename(fileUrl)
          const localFilePath = path.resolve(__dirname, '..', 'static/products', fileName)
          axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream'
          }).then(response => {
            response.data.pipe(fs.createWriteStream(localFilePath))
          })
        }
        Product.create({
          apiId: item.id,
          title: (item.name) ? item.name : '',
          description: (item.description) ? item.description.replace(/(<([^>]+)>)/ig, '') : '',
          price: (item.sizePrices[0] && item.sizePrices[0].price.currentPrice) ? item.sizePrices[0].price.currentPrice : 0,
          groupId: (item.groupId) ? item.groupId : '',
          parentGroup: (item.parentGroup) ? item.parentGroup : '',
          productCategoryId: (item.productCategoryId) ? item.productCategoryId : '',
          groupModifiers: (item.groupModifiers && item.groupModifiers[0]) ? JSON.stringify(item.groupModifiers.map(item => item.id)) : '',
          weight: (item.weight) ? item.weight : 0,
          type: 'dish',
          tags: JSON.stringify([
            {
              title: 'Энергетическая ценность',
              value: (item.energyAmount) ? item.energyAmount : 0
            },
            {
              title: 'Жир',
              value: (item.fatAmount) ? item.fatAmount : 0
            },
            {
              title: 'Белки',
              value: (item.proteinsAmount) ? item.proteinsAmount : 0
            },
            {
              title: 'Углеводы',
              value: (item.carbohydratesAmount) ? item.carbohydratesAmount : 0
            }
          ]),
          filter: (item.tags && item.tags.length > 0) ? JSON.stringify(item.tags) : '',
          image: (fileName) ? fileName : ''
        })
      }
    })
    products.map(async item => {
      if (item.type.toLowerCase() === 'modifier' && item.groupId) {
        // let image = /<id>(.*?)<\/id>/.exec(item.name) ? /<id>(.*?)<\/id>/.exec(item.name)[1] : false
        if (item.imageLinks && item.imageLinks[0]) {
          let fileName2 = ''
          const fileUrl2 = item.imageLinks[0]
          fileName2 = path.basename(fileUrl2)
          const localFilePath2 = path.resolve(__dirname, '..', 'static/dop', fileName2)
          axios({
            method: 'GET',
            url: fileUrl2,
            responseType: 'stream'
          }).then(response => {
            response.data.pipe(fs.createWriteStream(localFilePath2))
          })
          Product.create({
            apiId: item.id,
            title: (item.name) ? item.name.replace(/<([^\/>]+)>.*?<.*?\/.*?>/ig, '') : '',
            description: (item.description) ? item.description.replace(/(<([^>]+)>)/ig, '') : '',
            price: (item.sizePrices[0] && item.sizePrices[0].price.currentPrice) ? item.sizePrices[0].price.currentPrice : 0,
            groupId: (item.groupId) ? item.groupId : '',
            parentGroup: (item.parentGroup) ? item.parentGroup : '',
            productCategoryId: (item.productCategoryId) ? item.productCategoryId : '',
            weight: (item.weight) ? item.weight : 0,
            type: 'modifier',
            image: fileName2 ? fileName2 : '',
            tags: JSON.stringify([
              {
                title: 'Калорийность',
                value: (item.energyFullAmount) ? item.energyFullAmount : 0
              }
            ]),
          })
        }
      }
    })
    return { count: products.length, products: products }

  }
  async getUser(phone) {
    if (!phone) {
      return { status: false, message: 'Нет номера телефона' }
    }
    let config = await this.auth();
    let user = false;
    let userAll = false;

    await axios({
      method: 'post',
      url: this.url + 'loyalty/iiko/customer/info',
      data: {
        'organizationId': config.org,
        'phone': phone,
        'type': 'phone'
      },
      headers: config.header
    })
      .then(response => {
        user = response.data.walletBalances[0]
        userAll = response.data
      }).catch(e => console.error(e))

    if (user && userAll) {
      return { status: true, data: user, userAll: userAll }
    }
  }
  async createUser(data) {
    if (!data) {
      return { status: false, message: 'Нет обязательных полей' }
    }
    if (!data.phone) {
      return { status: false, message: 'Нет номера телефона' }
    }

    let config = await this.auth();
    let user = false;

    await axios({
      method: 'post',
      url: this.url + 'loyalty/iiko/customer/create_or_update',
      data: {
        'organizationId': config.org,
        'phone': data.phone,
      },
      headers: config.header
    })
      .then(response => {
        user = response.data
      }).catch(e => console.error(e, 'создание клиента'))


    if (user) {
      user = await this.getUser(data.phone).then(e => console.log(e)).catch(e => console.error(e, 'получение клиента'));
      if (user) {
        return { status: true, data: user }
      } else {
        return { status: false, data: user }
      }
    }
  }

  async sendOrder(order, address) {
    if (!order) {
      return { status: false, message: 'Нет данных о заказе' }
    }

    let config = await this.auth()
    let user
    let terminal
    let orderTypes
    let payment = []
    let status
    let deliveryStatus

    if (order.delivery === 2) {
      await axios({
        method: 'post',
        url: this.url + 'delivery_restrictions/allowed',
        data: {
          'organizationIds': [config.org],
          'deliveryAddress': {
            'streetId': order.streetId ? order.streetId : order.address && order.address.streetId ? order.address.streetId : '',
            'house': order.address && order.address.home ? order.address.home : order.home
          },
          "isCourierDelivery": true,
        },
        headers: config.header
      })
        .then(response => {
          console.log(response)
          deliveryStatus = response.data
        })
        .catch(error => {
          console.log(error)
          deliveryStatus = false
        })

      if (deliveryStatus && deliveryStatus.isAllowed) {

      } else {
        return { status: false, message: 'Данная улица не входит в зону доставки' }
      }
    }
    await axios({
      method: 'post',
      url: this.url + 'loyalty/iiko/customer/info',
      data: {
        'organizationId': config.org,
        'phone': order.phone,
        'type': 'phone'
      },
      headers: config.header
    })
      .then(response => {
        user = response.data.walletBalances[1]
      })
      .catch(error => console.error(error, 'Данные пользователя'))

    //Получение типы оплат
    await axios({
      method: 'post',
      url: this.url + 'payment_types',
      data: {
        'organizationIds': [config.org]
      },
      headers: config.header
    })
      .then(response => {

        let pay = response.data.paymentTypes.filter(item => item.code.toUpperCase() == order.payment.toUpperCase() && item)[0]

        if (!pay) {
          return { status: false, message: 'Не удалось определить тип платежа' }
        }
        payment.push({
          'paymentTypeKind': pay.paymentTypeKind,
          'paymentTypeId': pay.id,
          'sum': order.total
        })
        if (order.point && order.point > 0 && user.balance > 0 && user.balance >= order.point) {
          let payPoints = response.data.paymentTypes.filter(item => item.code.toUpperCase() == 'INET' && item)[0]
          if (payPoints) {
            payment.push({
              'paymentTypeKind': payPoints.paymentTypeKind,
              'paymentTypeId': payPoints.id,
              'sum': Number(order.point),
              'paymentAdditionalData': {
                'credential': '+' + order.phone,
                'searchScope': 'Phone',
                'type': payPoints.paymentTypeKind
              }
            })
            User.update({ point: user.balance - Number(order.point) }, { where: { phone: order.phone } })
          } else {
            return { status: false, message: 'Ошибка при получении данных о пользователе' }
          }
        } else if (order.point && order.point > 0 && user.balance < order.point) {
          return { status: false, message: 'У вас недостаточно баллов' }
        }

        if (order.delivery === 1) {
          let terminalInfo = pay.terminalGroups.filter(item => item.name.toUpperCase().indexOf(order.terminalAddress.toUpperCase()) > -1 && item)[0]
          if (!terminalInfo) {
            return { status: false, message: 'Не удалось определить терминал' }
          }
          terminal = terminalInfo ? terminalInfo.id : false
        }
      })
      .catch(error => console.error(error, 'Вывод терминала'))

    //Получение типов доставок
    await axios({
      method: 'post',
      url: this.url + 'deliveries/order_types',
      data: {
        'organizationIds': [config.org]
      },
      headers: config.header
    })
      .then(response => {
        let nameDelivery = 'Доставка Самовывоз Патент';
        if (order.delivery == 1) {
          nameDelivery = 'Доставка Самовывоз Патент';
        } else if (order.delivery == 2) {
          if (order.payment == 'alfa') {
            nameDelivery = 'Доставка курьером';
          } else {
            nameDelivery = 'Доставка Курьером Патент';
          }
        }
        orderTypes = response.data.orderTypes[0].items.filter(item => item.name.toUpperCase().indexOf(nameDelivery.toUpperCase()) > -1 && item)[0]
      })
      .catch(error => console.error(error, 'Ошибка при получении типа доставки'))

    let productData = order.products && typeof order.products == 'string' ? JSON.parse(order.products) : order.products

    let products = productData.map(item => {
      let dop = [];
      //   let dop = item.attribute && item.attribute[0] ?
      //     item.size ?
      //       item.attribute[0].filter(e => e.id == item.size.id && e).map(modifer => ({
      //         'productId': modifer.apiId,
      //         'amount': modifer.amount ? modifer.amount : 1,
      //         'productGroupId': modifer.groupId ? modifer.groupId : '',
      //         'price': modifer.price ? modifer.price : 0,
      //       }))
      //       : [{
      //         'productId': item.attribute[0][0].apiId,
      //         'amount': item.attribute[0][0].amount ? item.attribute[0][0].amount : 1,
      //         'productGroupId': item.attribute[0][0].groupId ? item.attribute[0][0].groupId : '',
      //         'price': item.attribute[0][0].price ? item.attribute[0][0].price : 0,
      //       }]
      //     : []

      if (item.dop) {
        item.dop.map(e => dop.push({
          'productId': e.apiId,
          'amount': e.amount ? e.amount : 1,
          'productGroupId': e.groupId ? e.groupId : '',
          'price': e.price ? e.price : 0,
        }));
      }

      return {
        'productId': item.apiId,
        'type': 'Product',
        'price': item.price ? item.price : 0,
        'amount': item.amount,
        'modifiers': dop
      }
    })

    var paymentText = ''
    if (order.payment == 'card') {
      paymentText = order.delivery == 1 ? 'Банковской картой в заведении' : 'Банковской картой курьеру'
    } else if (order.payment == 'alfa') {
      paymentText = 'Онлайн - Оплачено'
    } else {
      paymentText = 'Наличными'
    }

    //Отправка заявки
    await axios({
      method: 'post',
      url: this.url + 'deliveries/create',
      data: {
        'organizationId': config.org,
        'terminalGroupId': order.delivery == 1 ? terminal : null,
        'order': {
          'completeBefore': order.time == 1 ? null : order.timevalue && order.datevalue ? order.datevalue + ' ' + order.timevalue + ':00.123' : '',
          'phone': '+' + order.phone,
          'orderTypeId': orderTypes ? orderTypes.id : null,
          'customer': {
            'name': order.name ? order.name : '',
            'comment': `Источник: ${order.type == 'app' ? 'Приложение' : 'Сайт'} Тип оплаты: ${paymentText}}`
          },
          'items': products,
          'payments': payment,
          'comment': `Комментарий: ${order.comment ? order.comment : 'нет комментария'}`,
          deliveryPoint: order.delivery == 2 ? {
            'address': {
              'street': {
                'name': address.street ? address.street : '',
                'city': 'Казань',
              },
              'house': address.home ? address.home : '',
              'flat': address.apartment ? address.apartment : '',
              'entrance': address.entrance ? address.entrance : '',
              'floor': address.floor ? address.floor : '',
            },
          } : null
        }
      },
      headers: config.header
    })
      .then(async response => {
        console.log(response)
        status = { status: true, message: 'Заявка успешно отправлена' }
      })
      .catch(error => {
        console.error(error)
        status = { status: false, data: error, message: 'На данный адрес не производится доставка' }
      })

    if (status) {
      return status
    }
  }
}

module.exports = new Aiko()
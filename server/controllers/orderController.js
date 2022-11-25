const axios = require('axios')
const {
      User,
      Order,
      Address,
      Promo,
      Street,
      Notification
} = require('../models/models')
const Mail = require('../components/mail')
const Pay = require('../components/pay')
const Aiko = require('../components/aikoTransport')
const ApiError = require('../error/ApiError')
const NotificationsPush = require('../components/pushNotifications')

class OrderController {

      async create(req, res, next) {

            var data = req.body

            if (!data) {
                  return res.json({
                        status: false,
                        message: 'Нет данных для заказа'
                  })
            }
            if (!data.phone || data.phone.length < 10) {
                  return res.json({
                        status: false,
                        message: 'Введите номер телефона'
                  })
            }
            var address = {
                  streetId: (data.address && data.address.streetId) ? data.address.streetId : data.streetId,
                  street: (data.address && data.address.street) ? data.address.street : data.street,
                  home: (data.address && data.address.home) ? data.address.home : data.home,
                  entrance: (data.address && data.address.entrance) ? data.address.entrance : data.entrance,
                  code: (data.address && data.address.code) ? data.address.code : data.code,
                  floor: (data.address && data.address.floor) ? data.address.floor : data.floor,
                  apartment: (data.address && data.address.apartment) ? data.address.apartment : data.apartment
            }

            data.phone = data.phone.replace(/[^\d]/g, '')

            var payment = ''
            if (data.payment == 'card') {
                  payment = data.delivery == 1 ? 'Банковской картой в заведении' : 'Банковской картой курьеру'
            } else if (data.payment == 'alfa') {
                  payment = 'Онлайн - Оплачено'
            } else {
                  payment = 'Наличными'
            }

            let products = data.products.map(item => `<p>
            <b>${item.title}</b>
            - ${item.amount} шт
            - ${item.price * item.amount} р</p>
            ${item.dop ? item.dop.map(dop => `<small style="padding-left: 20px"><b>${dop.title}</b> - ${dop.price} р</small><br />`) : ''}`)

            let text = `<p>Имя: <b>${data.name}</b></p>
                  <p>Телефон: <b>+${data.phone}</b></p>
                  <p>Источник: <b>${data.type == 'app' ? 'Приложение' : 'Сайт'}</b></p>
                  <p>Оплаты: <b>${payment}</b></p>
                  <p>Доставка/Самовывоз: <b>${data.delivery == 1 ? 'Самовывоз' : 'Доставка'}</b></p>
                  ${data.delivery == 2 ? '<p>Адрес: <b>' : ''}
                  ${data.street ? data.street : ''} 
                  ${data.home ? `дом ${data.home}` : ''} 
                  ${data.entrance ? `подъезд ${data.entrance}` : ''} 
                  ${data.floor ? `этаж ${data.floor}` : ''} 
                  ${data.apartment ? `кв ${data.apartment}` : ''} 
                  ${data.code ? `код ${data.code}` : ''}
                  ${data.delivery == 2 ? '</b></p>' : ''}
                  <p>Время готовки: <b>${data.time == 1 ? 'Сейчас' : `К ${data.datevalue} ${data.timevalue}`}</b></p>
                  <p>Комментарий: <b>${data.comment ? data.comment : 'Нет комемнтария'}</b></p>
                  <p>Товары: ${products}</p>
                  ${data.point && data.point > 0 ? `<p style="color: green">Списание баллами: <b>${data.point} баллов</b></p>` : ''}
                  <h2>Итого: <b>${data.total} руб</b></h2>`

            await Order.create({
                  name: data.name,
                  phone: data.phone,
                  user: (data.user) ? data.user : 0,
                  payment: data.payment,
                  point: data.point ? Number(data.point) : 0,
                  delivery: data.delivery,
                  time: data.time == 1 ? '' : data.timevalue && data.datevalue ? data.datevalue + ' ' + data.timevalue + ':00' : '',
                  products: JSON.stringify(data.products),
                  size: data.size ? data.size : '',
                  street: address.street ? address.street : '',
                  home: address.home ? address.home : '',
                  entrance: address.entrance ? address.entrance : '',
                  code: address.code ? address.code : '',
                  floor: address.floor ? address.floor : '',
                  apartment: address.apartment ? address.apartment : '',
                  total: data.total,
                  comment: data.comment ? data.comment : '',
                  sale: (data.sale) ? JSON.stringify(data.sale) : '',
                  type: data.type ? data.type : 'site',
            }).then(async result => {
                  if (result && result.id) {
                        if (data.payment == 'alfa') {
                              if (data.saveaddress && data.user && data.delivery == 2) {
                                    await Address.create({
                                          user: data.user,
                                          name: (address.street) ? address.street : '',
                                          street: (address.street) ? address.street : '',
                                          home: (address.home) ? address.home : '',
                                          entrance: (address.entrance) ? address.entrance : '',
                                          code: (address.code) ? address.code : '',
                                          floor: (address.floor) ? address.floor : '',
                                          apartment: (address.apartment) ? address.apartment : '',
                                    });
                              }
                              let products = []
                              data.products && data.products.map(item => {
                                    item.attribute &&
                                          item.size ?
                                          item.attribute[0].filter(e => e.id == item.size.id && e).map(modifer => {
                                                products.push({
                                                      positionId: item.id,
                                                      name: item.title + (modifer.title ? ' ' + modifer.title : ''),
                                                      itemCode: item.id,
                                                      quantity: {
                                                            measure: 0,
                                                            value: modifer.amount ? Number(modifer.amount) : 1,
                                                      },
                                                      itemAmount: (Number(modifer.price) * (item.amount ? Number(item.amount) : 1)) * 100,
                                                      itemPrice: modifer.price * 100,

                                                })
                                          }) :
                                          products.push({
                                                positionId: item.id,
                                                name: item.title + (item.attribute != null && item.attribute.length > 0 && item.attribute[0][0] && item.attribute[0][0].title ? ' ' + item.attribute[0][0].title : ' '),
                                                itemCode: item.id,
                                                quantity: {
                                                      measure: 0,
                                                      value: item.amount ? Number(item.amount) : 1,
                                                },
                                                itemAmount: item.price * (item.amount ? Number(item.amount) : 1) * 100,
                                                itemPrice: item.price * 100,
                                          })

                                    // if (item.dop) {
                                    //       item.dop.map(e => products.push({
                                    //             positionId: e.id,
                                    //             name: e.title,
                                    //             itemCode: e.id, 
                                    //             quantity: {
                                    //                   measure: 0,
                                    //                   value: e.amount ? Number(e.amount) : 1,
                                    //             },
                                    //             itemAmount: (Number(e.price) * (e.amount ? Number(e.amount) : 1)) * 100,
                                    //             itemPrice: e.price * 100,

                                    //       }))
                                    // }
                              })
                              if (data.delivery == 2 && data.total < 1000) {
                                    products.push({
                                          positionId: 0,
                                          name: 'Доставка',
                                          itemCode: 0,
                                          quantity: {
                                                measure: 0,
                                                value: 1,
                                          },
                                          itemAmount: 150 * 100,
                                          itemPrice: 150 * 100,

                                    })
                              }

                              const response = await Pay.alfa(data, products, result);

                              if (response && response.orderId) {

                                    Order.update({
                                          paymentId: response.orderId
                                    }, {
                                          where: {
                                                id: result.id
                                          }
                                    })
                                    return res.json({
                                          status: true,
                                          message: 'Оплатите заказ',
                                          data: response
                                    })
                              } else {
                                    // return res.json({ status: false, message: response.errorMessage })
                                    Order.destroy({
                                          where: {
                                                id: result.id
                                          }
                                    });

                                    return res.json({
                                          status: false,
                                          message: 'Ошибка при оплате',
                                          data: response
                                    })
                              }
                        } else {
                              await Aiko.sendOrder(data, address).then(async aikoStatus => {
                                    if (aikoStatus && aikoStatus.status) {
                                          if (data.saveaddress && data.user && data.delivery == 2) {
                                                await Address.create({
                                                      user: data.user,
                                                      name: (address.street) ? address.street : '',
                                                      street: (address.street) ? address.street : '',
                                                      home: (address.home) ? address.home : '',
                                                      entrance: (address.entrance) ? address.entrance : '',
                                                      code: (address.code) ? address.code : '',
                                                      floor: (address.floor) ? address.floor : '',
                                                      apartment: (address.apartment) ? address.apartment : '',
                                                });
                                          }

                                          await Mail.send(text)

                                          if (data.email) {
                                                await Mail.send(text, data.email)
                                          }
                                          if (data.user) {
                                                let userData = await User.findOne({
                                                      where: {
                                                            id: data.user
                                                      }
                                                });

                                                if (userData && userData.push_token) {
                                                      let params = { name: 'Settings', params: { data: { id: 3 } } };
                                                      let text = 'Мы приняли ваш заказ. Ожидайте звонок оператора для подтверждения заказа.';
                                                      await Notification.create({
                                                            userId: userData.id,
                                                            title: 'Заказ принят',
                                                            desc: 'Мы приняли ваш заказ. Ожидайте звонок оператора для подтверждения заказа.',
                                                            params: JSON.stringify(params),
                                                      });
                                                      await NotificationsPush.send(
                                                            text,
                                                            params,
                                                            [userData.push_token]
                                                      );
                                                } else {
                                                      let params = { name: 'Settings', params: { data: { id: 3 } } };
                                                      await Notification.create({
                                                            userId: userData.id,
                                                            title: 'Заказ принят',
                                                            desc: 'Мы приняли ваш заказ. Ожидайте звонок оператора для подтверждения заказа.',
                                                            params: JSON.stringify(params),
                                                      });
                                                }
                                          }
                                          data = null;
                                          text = null;
                                          return res.json({
                                                status: true,
                                                message: 'Заявка успешно отправлена',
                                                data: result
                                          })

                                    } else if (aikoStatus) {

                                          return res.json({
                                                status: false,
                                                message: aikoStatus.message ? aikoStatus.message : 'Ошибка при создании заказа айко'
                                          })
                                    } else {
                                          return res.json({
                                                status: false,
                                                message: 'Произошла неизвестная ошибка при заказе'
                                          })
                                    }
                              }).catch(error => {
                                    console.log(error)
                                    return res.json({
                                          status: false,
                                          message: 'Ошибка при создании заказа',
                                          data: error
                                    })
                              })
                        }
                  }

            }).catch((e) => {
                  console.log(e)
                  next(ApiError.badRequest(e.message))
            })

      }
      //https://api.refettorio.cafe/order/webhook?checksum=599CE7F52EB9BC80811C0145C3EF255DE52EEABC766C19AE70B9398BC35CFC04&orderNumber=446&mdOrder=af0bebc7-500c-7c51-a893-975404441251&operation=deposited&status=0
      async webhook(req, res) {

            var body = req.query //req.body

            if (body && body.mdOrder && Number(body.status) == 1 && body.operation == 'deposited') {

                  var data = await Order.findOne({
                        where: {
                              paymentId: body.mdOrder
                        }
                  })
                  if (data && data.status === 0) {

                        await Order.update({
                              status: 1
                        }, {
                              where: {
                                    paymentId: body.mdOrder
                              }
                        })

                        var address = {
                              street: (data.street) ? data.street : '',
                              home: (data.home) ? data.home : '',
                              entrance: (data.entrance) ? data.entrance : '',
                              code: (data.code) ? data.code : '',
                              floor: (data.floor) ? data.floor : '',
                              apartment: (data.apartment) ? data.apartment : ''
                        }
                        let productData = data.products && typeof data.products == 'string' ? JSON.parse(data.products) : data.products

                        let products = productData.map(item => `<p>
                                    <b>${item.title}</b>
                                    - ${item.amount} шт
                                    - ${item.price * item.amount} р</p>
                                    ${item.dop ? item.dop.map(dop => `<small style="padding-left: 20px"><b>${dop.title}</b> - ${dop.price} р</small><br />`) : ''}`)

                        let text = `<p>Имя: <b>${data.name}</b></p>
                                    <p>Телефон: <b>+${data.phone}</b></p>
                                    <p>Источник: <b>${data.type == 'app' ? 'Приложение' : 'Сайт'}</b></p>
                                    <p>Оплаты: <b>Онлайн оплата</b></p>
                                    <p>Доставка/Самовывоз: <b>${data.delivery == 1 ? 'Самовывоз' : 'Доставка'}</b></p>
                                    ${data.delivery == 2 ? '<p>Адрес: <b>' : ''}
                                    ${data.street ? data.street : ''} 
                                    ${data.home ? `дом ${data.home}` : ''} 
                                    ${data.entrance ? `подъезд ${data.entrance}` : ''} 
                                    ${data.floor ? `этаж ${data.floor}` : ''} 
                                    ${data.apartment ? `кв ${data.apartment}` : ''} 
                                    ${data.code ? `код ${data.code}` : ''}
                                    ${data.delivery == 2 ? '</b></p>' : ''}
                                    <p>Время готовки: <b>${data.time == 1 ? 'Сейчас' : `К ${data.datevalue} ${data.timevalue}`}</b></p>
                                    <p>Комментарий: <b>${data.comment ? data.comment : 'Нет комметария'}</b></p>
                                    <p>Товары: ${products}</p>
                                    ${data.point && data.point > 0 ? `<p style="color: green">Списание баллами: <b>${data.point} баллов</b></p>` : ''}
                                    <h2>Итого: <b>${data.total} руб</b></h2>`

                        await Aiko.sendOrder(data, address)
                        await Mail.send(text)
                        if (data.email) {
                              await Mail.send(text, data.email)
                        }

                        if (data.user) {
                              var user = await User.findOne({
                                    where: {
                                          id: data.user
                                    }
                              })
                              if (user && user.push_token) {
                                    let params = { name: 'Settings', params: { data: { id: 3 } } };
                                    let text = 'Мы приняли ваш заказ. Ожидайте звонок оператора для подтверждения заказа.';
                                    await Notification.create({
                                          userId: user.id,
                                          title: 'Заказ принят',
                                          desc: 'Мы приняли ваш заказ. Ожидайте звонок оператора для подтверждения заказа.',
                                          params: JSON.stringify(params),
                                    });
                                    await NotificationsPush.send(
                                          text,
                                          params,
                                          [user.push_token]
                                    );
                              } else {
                                    let params = { name: 'Settings', params: { data: { id: 3 } } };
                                    await Notification.create({
                                          userId: user.id,
                                          title: 'Заказ принят',
                                          desc: 'Мы приняли ваш заказ. Ожидайте звонок оператора для подтверждения заказа.',
                                          params: JSON.stringify(params),
                                    });
                              }
                        }
                        return res.json('OK')
                  } else {
                        return res.json('ERROR')
                  }
            } else {
                  return res.json('ERROR')
            }
      }
      async getOrders(req, res) {
            const { user } = req.body
            if (user) {
                  const orders = await Order.findAll({
                        where: { user },
                        order: [['id', 'DESC']],
                        limit: 40
                  })
                  return res.json(orders)
            } else {
                  return res.json('Ошибка при получении истории заказов')
            }
      }
      async promo(req, res) {
            const {
                  user,
                  code,
                  total
            } = req.body
            if (code) {
                  const info = await Promo.findOne({
                        where: {
                              code,
                              status: 1
                        }
                  })
                  if (info) {
                        if (info.authUser === 1 && !user) {
                              return res.json({
                                    status: 0,
                                    text: 'Сначала авторизуйтесь'
                              })
                        }
                        if (info.minTotal > total) {
                              return res.json({
                                    status: 0,
                                    text: 'Минимальная сумма заказа ' + info.minTotal
                              })
                        }
                        if (info.maxTotal !== 0 && info.maxTotal < total) {
                              return res.json({
                                    status: 0,
                                    text: 'Максимальная сумма заказа ' + info.minTotal
                              })
                        }
                        if (info.maxOrder !== 0) {
                              const orderPromo = await Order.findOne({
                                    where: {
                                          user,
                                          promo: code
                                    }
                              })
                              if (orderPromo) {
                                    return res.json({
                                          status: 0,
                                          text: 'Вы уже использовали данный промокод'
                                    })
                              }
                        }
                        return res.json({
                              status: 1,
                              text: 'Промокод применен',
                              data: info
                        })
                  } else {
                        return res.json({
                              status: 0,
                              text: 'Промокода не существует'
                        })
                  }
            } else {
                  return res.json({
                        status: 0,
                        text: 'Введите промокод'
                  })
            }
      }
      async getStreets(req, res) {
            let streets = await Street.findAndCountAll({
                  order: [
                        ['id', 'ASC']
                  ]
            })
            return res.json(streets)
      }
}

module.exports = new OrderController()
import React, { useContext, useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { Context } from "../../index"
import { getOrders } from "../../http/orderAPI"
import { PROFILE_ROUTE, HOME_ROUTE } from "../../utils/consts"
import SideBar from "./components/menu"

const Orders = () => {
    const { id } = useParams()
    const { user } = useContext(Context)
    const [orders, setOrders] = useState(false)

    useEffect(() => {
        getOrders(user.user.id).then(data => {
            if (data) {
                setOrders(data)
            }
        })
    }, [])

    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-13" className="mb-8">
                <div className="container">
                    <div className="row">
                        <SideBar />
                        <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                            <h5>История заказов</h5>
                            {
                                (orders && orders.length > 0) ?
                                    <div className="order-history mt-4 mt-lg-5 mb-5">
                                        <div className="head">
                                            <div>Состав</div>
                                            <div>Адрес доставки</div>
                                            <div>Дата заказа</div>
                                            <div>Сумма</div>
                                        </div>
                                        <div className="body">
                                            {
                                                orders.map(item => {
                                                    return (
                                                        <div className="order">
                                                            <div>
                                                                <div className="gray-1 pb-2 fw-5">Заказ № {item.id}</div>
                                                                {
                                                                    JSON.parse(item.products).map((cart, i) => {
                                                                        var param = (cart.param) ? JSON.parse(cart.param)[0] : false
                                                                        var total = cart.price * cart.count
                                                                        if (cart.dop) {
                                                                            cart.dop.map(dop => total += dop.price)
                                                                        }
                                                                        return (
                                                                            <>
                                                                                <tr>
                                                                                    <td>
                                                                                        <div className="pb-2">{cart.title} <span className="gray-3">{(cart.count) ? cart.count : 1} шт</span></div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className="gray-1 text-end">{total} ₽</div>
                                                                                    </td>
                                                                                </tr>
                                                                                {
                                                                                    (cart.dop && cart.dop.length > 0) &&
                                                                                    cart.dop.map(dop => (
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div className="pb-2 fw-light"><small>{dop.title} <span className="gray-3 fw-light">{(dop.count) ? dop.count : 1} шт</span></small></div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="gray-1 text-end fw-light"><small>{dop.price} ₽</small></div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                        )
                                                                    })

                                                                }
                                                            </div>
                                                            <div>
                                                                <div className="gray-1 fw-5">{item.delivery == 1 ? 'Самовывоз' : 'Доставка'}</div>
                                                                {item.delivery == 2 ? <div className="gray-2 mt-2">{item.street + ' ' + item.home + ((item.entrance) ? ' подъезд ' + item.entrance : '') + ((item.floor) ? ' этаж ' + item.floor : '') + ((item.apartment) ? ' кв ' + item.apartment : '') + ((item.code) ? ' код ' + item.code : '')}</div> : null}
                                                            </div>
                                                            <div>
                                                                <div className="gray-1">{new Date(item.createdAt).toLocaleString()}</div>
                                                            </div>
                                                            <div>
                                                                <div className="gray-1 fw-5">{item.total} ₽</div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <div className="gray-2 text-start mb-4">У вас пока не было ни одного заказа. Добавляйте <br /> товары и оформите свой первый заказ.</div>
                                        <Link to={HOME_ROUTE} className="btn btn-2 mb-5">В каталог</Link>
                                    </>
                            }
                            <Link to={PROFILE_ROUTE} className="gray-3 d-flex align-items-center">
                                <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                Вернуться назад
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Orders

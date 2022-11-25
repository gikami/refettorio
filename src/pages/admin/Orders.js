import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { ADMIN_ROUTE } from "../../utils/consts"
import Pagination from "./components/Pagination"
import { NotificationManager } from "react-notifications"
import { getOrder, getOrders, editOrder, deleteOrder, createOrder } from "../../http/adminAPI"

const Orders = () => {
    const { action, page } = useParams()
    const [orders, setOrders] = useState(false)
    const [order, setOrder] = useState(false)
    const [pageAll, setPageAll] = useState(1)

    useEffect(() => {
        if (action) {
            getOrder(action).then(data => {
                setOrder(data.order)
            })
        } else {
            getOrders((page) ? page : 1, 40).then(data => {
                setOrders(data)
                setPageAll(Number(Math.round(Number(data.count) / 40)))
            })
        }
    }, [page])

    const change = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value })
    }

    const submit = async (e) => {
        try {
            e.preventDefault()
            let data = await editOrder(order)
            if (data) {
                NotificationManager.success('Данные успешно сохранены')
            } else {
                NotificationManager.error('Произошла неизвестная ошибка')
            }
        } catch (e) {
            if (e.response && e.response.data) {
                NotificationManager.error(e.response.data.message)
            } else {
                NotificationManager.error(e)
            }
        }
    }

    if (order) {
        return (
            <div>
                <div className="d-flex justify-content-between mb-4">
                    <h5>#{order.id}</h5>
                </div>
                <form onSubmit={submit} onChange={change} >
                    <fieldset className="mb-3">
                        <div className="sec-font mb-2">Клиент</div>
                        <input type="text" placeholder="Имя клиента" name="name" value={order.name} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-3">
                        <div className="sec-font mb-2">Номер телефона</div>
                        <input type="text" placeholder="Телефон клиента" name="phone" value={order.phone} className="mb-3" />
                    </fieldset>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-1 mx-2">Сохранить изменения</button>
                        <button className="btn btn-2 mx-2">Удалить</button>
                    </div>
                </form>
            </div>
        )
    } else if (orders) {

        return (
            <div className="admin-page">
                <div className="d-flex justify-content-between mb-4">
                    <h5>Заказы ({(orders.count) ? orders.count : 0})</h5>
                </div>
                {
                    (orders && orders.count > 0 && pageAll) ?

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">id</th>
                                    <th scope="col">Клиент</th>
                                    <th scope="col">Телефон</th>
                                    <th scope="col">Адрес</th>
                                    <th scope="col">Сумма</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.rows.map(item => (
                                        <tr>
                                            <td scope="row">{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.street} {item.home}</td>
                                            <td>{item.total} руб</td>
                                            <td align="right"><Link to={ADMIN_ROUTE + '/orders/' + item.id}>Редактировать</Link></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        : 'Нет заказов'
                }
                <Pagination data={pageAll} url={String('orders')} />
            </div>
        )
    } else {
        return ''
    }
}

export default Orders
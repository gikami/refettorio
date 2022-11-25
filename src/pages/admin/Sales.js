import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { ADMIN_ROUTE } from "../../utils/consts"
import Pagination from "./components/Pagination"
import { NotificationManager } from "react-notifications"
import { getSale, getSales, editSale, deleteSale, createSale } from "../../http/adminAPI"

const Sales = () => {
    const { action, page } = useParams()
    const [sales, setSales] = useState(false)
    const [sale, setSale] = useState(false)
    const [file, setFile] = useState(false)
    const [pageAll, setPageAll] = useState(1)

    useEffect(() => {
        if (Number(action)) {
            getSale(action).then(data => {
                setSale(data.sale)
            })
        } else if (!action) {
            getSales((page) ? page : 1, 40).then(data => {
                setSales(data)
                setPageAll(Number(Math.round(Number(data.count) / 40)))
            })
        }
    }, [page])

    const change = (e) => {
        setSale({ ...sale, [e.target.name]: e.target.value })
    }
    const selectFile = e => {
        setFile(e.target.files[0])
    }

    if (action === 'add') {
        const submit = async (e) => {
            try {
                e.preventDefault()

                let formData = new FormData()
                formData.append('title', sale.title)
                formData.append('desc', sale.desc)
                formData.append('image', file)

                await createSale(formData)
                    .then(res => (NotificationManager.success('Акция добавлена')))
                    .catch(err => (NotificationManager.error('Ошибка при добавлении акции')))


            } catch (e) {
                if (e.response && e.response.data) {
                    NotificationManager.error(e.response.data.message)
                } else {
                    NotificationManager.error(e)
                }
            }
        }
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <h5>Создать акцию</h5>
                </div>
                <form onSubmit={submit} >
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Название</div>
                        <input type="text" placeholder="Введите название" onChange={change} name="title" value={sale.title} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Описание</div>
                        <textarea rows="6" type="text" onChange={change} placeholder="Введите описание" name="desc" value={sale.desc} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Обложка</div>
                        <input type="file" name="image" onChange={selectFile} className="mb-3" />
                    </fieldset>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-1 mx-2">Добавить</button>
                    </div>
                </form>
            </div>
        )
    } else if (sale) {
        const submit = async (e) => {
            try {
                e.preventDefault()

                let formData = new FormData()
                formData.append('id', sale.id)
                formData.append('title', sale.title)
                formData.append('desc', sale.desc)
                if (file) {
                    formData.append('image', file)
                }
                let data = await editSale(formData)

                if (data) {
                    NotificationManager.success('Акция обновлена')
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
        const deleteSaleBtn = async (e) => {
            try {
                e.preventDefault()

                let formData = new FormData()
                formData.append('id', sale.id)
                let data = await deleteSale(formData)

                if (data) {
                    NotificationManager.success('Акция удалена')
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
        return (
            <div>
                <div className="d-flex justify-content-between mb-4">
                    <h5>{sale.title}</h5>
                    <Link
                        className="btn btn-1"
                        to={ADMIN_ROUTE + '/sales/add'}
                    >
                        Добавить акцию
                    </Link>
                </div>
                <form onSubmit={submit} >
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Название</div>
                        <input type="text" onChange={change} placeholder="Введите название" name="title" value={sale.title} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Описание</div>
                        <textarea rows="6" onChange={change} type="text" placeholder="Введите описание" name="desc" value={sale.desc} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Обложка</div>
                        {(sale.image) ? <img className="mb-3" width="200" src={process.env.REACT_APP_API_URL + 'sale/' + sale.image} /> : null}
                        <input type="file" onChange={selectFile} className="mb-3" />
                    </fieldset>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-1 mx-2">Сохранить изменения</button>
                        <button className="btn btn-2 mx-2" onClick={() => deleteSaleBtn()}>Удалить</button>
                    </div>
                </form>
            </div>
        )
    } else if (sales) {
        console.log(sales)
        return (
            <div className="admin-page">
                <div className="d-flex justify-content-between mb-4">
                    <h5>Акции ({(sales.count) ? sales.count : 0})</h5>
                    <Link
                        className="btn btn-1"
                        to={ADMIN_ROUTE + '/sales/add'}
                    >
                        Добавить акцию
                    </Link>
                </div>
                {
                    (sales && sales.count > 0 && pageAll || pageAll === 0) ?

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">id</th>
                                    <th></th>
                                    <th scope="col">Название</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sales.rows.map(item => (
                                        <tr>
                                            <td scope="row">{item.id}</td>
                                            <td>{(item.image) ? <img width="40" src={process.env.REACT_APP_API_URL + 'sale/' + item.image} /> : ''}</td>
                                            <td><b>{item.title}</b><p className="gray-3"><small>{item.desc}</small></p></td>
                                            <td align="right"><Link to={ADMIN_ROUTE + '/sales/' + item.id}>Редактировать</Link></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        : 'Нет акций'
                }
                <Pagination data={pageAll} url={String('sales')} />
            </div>
        )
    } else {
        return <div className="admin-page">
            <div className="d-flex justify-content-between mb-4">
                <h5>Акции ({(sales.count) ? sales.count : 0})</h5>
                <Link
                    className="btn btn-1"
                    to={ADMIN_ROUTE + '/sales/add'}
                >
                    Добавить акцию
                </Link>
            </div>
        </div>
    }
}

export default Sales
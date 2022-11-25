import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { ADMIN_ROUTE } from "../../utils/consts"
import Pagination from "./components/Pagination"
import { NotificationManager } from "react-notifications"
import { getProduct, getProducts, editProduct, deleteProduct, createProduct, getCategories } from "../../http/adminAPI"

const Products = () => {
    const { action, page } = useParams()
    const [products, setProducts] = useState(false)
    const [product, setProduct] = useState(false)
    const [file, setFile] = useState(false)
    const [categories, setCategories] = useState(false)
    const [pageAll, setPageAll] = useState(1)

    useEffect(() => {
        if (Number(action)) {
            getProduct(action).then(data => {
                setProduct(data.product)
            })
            getCategories().then(data => {
                setCategories(data.rows)
            })
        } else if (action === 'add') {
            getCategories().then(data => {
                setCategories(data.rows)
            })
        } else if (!action) {
            getProducts((page) ? page : 1, 40).then(data => {
                setProducts(data)
                setPageAll(Number(Math.round(Number(data.count) / 40)))
            })
        }
    }, [page])

    const change = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }
    const selectFile = e => {
        setFile(e.target.files[0])
    }

    if (action === 'add') {
        const submit = async (e) => {
            try {
                e.preventDefault()

                let formData = new FormData()
                formData.append('title', product.title)
                formData.append('price', product.price)
                formData.append('sale', product.sale)
                formData.append('category', (product.category) ? product.category : 1)
                formData.append('mini_description', product.mini_description)
                formData.append('description', product.description)
                formData.append('image', file)

                let data = await createProduct(formData)

                if (data) {
                    NotificationManager.success('Товар добавлен')
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
                <div className="d-flex justify-content-between">
                    <h5>Создать товар</h5>
                </div>
                <form onSubmit={submit} >
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Название</div>
                        <input type="text" placeholder="Введите название" onChange={change} name="title" value={product.title} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Категория</div>
                        <select name="category" onChange={change}>
                            {
                                (categories && categories.length > 0) ? categories.map(item => (<option value={item.id}>{item.title}</option>)) : <option value={0}>Нет категорий</option>
                            }
                        </select>
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Состав</div>
                        <textarea rows="4" type="text" onChange={change} placeholder="Введите состав" name="mini_description" value={product.mini_description} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Описание</div>
                        <textarea rows="6" type="text" onChange={change} placeholder="Введите описание" name="description" value={product.description} className="mb-3" />
                    </fieldset>
                    <div className="row">
                        <fieldset className="col-6 mb-2">
                            <div className="sec-font mb-2">Цена</div>
                            <input type="number" onChange={change} placeholder="0" name="price" value={product.price} className="mb-3" />
                        </fieldset>
                        <fieldset className="col-6 mb-2">
                            <div className="sec-font mb-2">Цена со скидкой</div>
                            <input type="number" onChange={change} placeholder="0" name="sale" value={product.sale} className="mb-3" />
                        </fieldset>
                    </div>
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
    } else if (product) {
        const submit = async (e) => {
            try {
                e.preventDefault()

                let formData = new FormData()
                formData.append('id', product.id)
                formData.append('title', product.title)
                formData.append('price', product.price)
                formData.append('sale', product.sale)
                formData.append('category', (product.category) ? product.category : 1)
                formData.append('mini_description', product.mini_description)
                formData.append('description', product.description)
                if (file) {
                    formData.append('image', file)
                }
                let data = await editProduct(formData)
                console.log(data)
                if (data) {
                    NotificationManager.success('Товар обновлен')
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
                    <h5>{product.title}</h5>
                    <Link
                        className="btn btn-1"
                        to={ADMIN_ROUTE + '/products/add'}
                    >
                        Добавить товар
                    </Link>
                </div>
                <form onSubmit={submit} >
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Название</div>
                        <input type="text" onChange={change} placeholder="Введите название" name="title" value={product.title} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Категория</div>
                        <select name="category" onChange={change}>
                            {
                                (categories && categories.length > 0) ? categories.map(item => (<option value={item.id} selected={Number(product.category) === Number(item.id) && true}>{item.title}</option>)) : <option value={0}>Нет категорий</option>
                            }
                        </select>
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Состав</div>
                        <textarea rows="4" onChange={change} type="text" placeholder="Введите состав" name="mini_description" value={product.mini_description} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Описание</div>
                        <textarea rows="6" onChange={change} type="text" placeholder="Введите описание" name="description" value={product.description} className="mb-3" />
                    </fieldset>
                    <div className="row">
                        <fieldset className="col-6 mb-2">
                            <div className="sec-font mb-2">Цена</div>
                            <input type="number" onChange={change} placeholder="0" name="price" value={product.price} className="mb-3" />
                        </fieldset>
                        <fieldset className="col-6 mb-2">
                            <div className="sec-font mb-2">Цена со скидкой</div>
                            <input type="number" onChange={change} placeholder="0" name="sale" value={product.sale} className="mb-3" />
                        </fieldset>
                    </div>
                    <fieldset className="mb-2">
                        <div className="sec-font mb-2">Обложка</div>
                        {(product.image) ? <img className="mb-3" width="200" src={process.env.REACT_APP_API_URL + 'products/' + product.image} /> : null}
                        <input type="file" onChange={selectFile} className="mb-3" />
                    </fieldset>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-1 mx-2">Сохранить изменения</button>
                        <button className="btn btn-2 mx-2">Удалить</button>
                    </div>
                </form>
            </div>
        )
    } else if (products) {

        return (
            <div className="admin-page">
                <div className="d-flex justify-content-between mb-4">
                    <h5>Товары ({(products.count) ? products.count : 0})</h5>
                    <Link
                        className="btn btn-1"
                        to={ADMIN_ROUTE + '/products/add'}
                    >
                        Добавить товар
                    </Link>
                </div>
                {
                    (products && products.count > 0 && pageAll) ?

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
                                    products.rows.map(item => (
                                        <tr>
                                            <td scope="row">{item.id}</td>
                                            <td>{(item.image) ? <img width="40" src={process.env.REACT_APP_API_URL + 'products/' + item.image} /> : ''}</td>
                                            <td><b>{item.title}</b><p className="gray-3"><small>{item.description}</small></p></td>
                                            <td align="right"><Link to={ADMIN_ROUTE + '/products/' + item.id}>Редактировать</Link></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        : 'Нет товаров'
                }
                <Pagination data={pageAll} url={String('products')} />
            </div>
        )
    } else {
        return ''
    }
}

export default Products
import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { ADMIN_ROUTE } from "../../utils/consts"
import Pagination from "./components/Pagination"
import { NotificationManager } from "react-notifications"
import { getCategory, getCategories, editCategory, deleteCategory, createCategory } from "../../http/adminAPI"

const Categories = () => {
    const { action, page } = useParams()
    const [categories, setCategories] = useState(false)
    const [category, setCategory] = useState(false)
    const [pageAll, setPageAll] = useState(1)

    useEffect(() => {
        if (Number(action)) {
            getCategory(action).then(data => {
                setCategory(data.category)
            })
        } else if (!action) {
            getCategories((page) ? page : 1, 40).then(data => {
                setCategories(data)
                setPageAll(Number(Math.round(Number(data.count) / 40)))
            })
        }

    }, [])

    const change = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value })
    }

    if (action === 'add') {
        const submit = async (e) => {
            try {
                e.preventDefault()
                let data = await createCategory(category)
                if (data) {
                    NotificationManager.success('Категория добавлена')
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
                    <h5>Создать категорию</h5>
                </div>
                <form onSubmit={submit} onChange={change} >
                    <fieldset className="mb-3">
                        <div className="sec-font mb-2">Название</div>
                        <input type="text" placeholder="Введите название" name="title" value={category.title} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-3">
                        <div className="sec-font mb-2">Порядок</div>
                        <input type="number" placeholder="0" name="priority" value={category.priority} className="mb-3" />
                    </fieldset>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-1">Добавить</button>
                    </div>
                </form>
            </div>
        )
    } else if (category) {
        const submit = async (e) => {
            try {
                e.preventDefault()
                let data = await editCategory(category)
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
        return (
            <div>
                <div className="d-flex justify-content-between mb-4">
                    <h5>{category.title}</h5>
                    <Link
                        className="btn btn-1"
                        to={ADMIN_ROUTE + '/categories/add'}
                    >
                        Добавить категорию
                    </Link>
                </div>
                <form onSubmit={submit} onChange={change} >
                    <fieldset className="mb-3">
                        <div className="sec-font mb-2">Название</div>
                        <input type="text" placeholder="Введите название" name="title" value={category.title} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-3">
                        <div className="sec-font mb-2">Порядок</div>
                        <input type="number" placeholder="0" name="priority" value={category.priority} className="mb-3" />
                    </fieldset>
                    <fieldset className="mb-3">
                        <div className="sec-font mb-2">Статус</div>
                        <input type="number" placeholder="1" name="status" value={category.status} className="mb-3" />
                    </fieldset>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-1 mx-2">Сохранить изменения</button>
                        <button className="btn btn-2 mx-2">Удалить</button>
                    </div>
                </form>
            </div>
        )
    } else if (categories) {
        return (
            <div className="admin-page">
                <div className="d-flex justify-content-between mb-4">
                    <h5>Категории ({(categories.count) ? categories.count : 0})</h5>
                    <Link
                        className="btn btn-1"
                        to={ADMIN_ROUTE + '/categories/add'}
                    >
                        Добавить категорию
                    </Link>
                </div>
                {
                    (categories && categories.count > 0) ?

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">id</th>
                                    <th scope="col">Название</th>
                                    <th scope="col">Порядок</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categories.rows.map(item => (
                                        <tr>
                                            <td scope="row">{item.id}</td>
                                            <td>{item.title}</td>
                                            <td>{item.priority}</td>
                                            <td align="right"><Link to={ADMIN_ROUTE + '/categories/' + item.id}>Редактировать</Link></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        : 'Нет категорий'
                }
                <Pagination data={pageAll} url={String('categories')} />
            </div>
        )
    } else {
        return ''
    }
}

export default Categories
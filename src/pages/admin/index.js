import React, { useState, useEffect, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import Menu from "./components/Menu"
import Categories from "./Categories"
import Notifications from "./Notifications"
import Products from "./Products"
import Orders from "./Orders"
import Sales from "./Sales"
import { Context } from "../../index"
import { getAikoStreets, getAikoCategories, getAikoProducts, getCategories, getProducts } from "../../http/adminAPI"
import { getStreets } from "../../http/orderAPI"

const Admin = () => {
    const { user } = useContext(Context)
    const { id } = useParams()
    const [streets, setStreets] = useState(false)
    const [categories, setCategories] = useState(false)
    const [products, setProducts] = useState(false)
    const [loadingStreets, setLoadingStreets] = useState(false)
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [loadingProducts, setLoadingProducts] = useState(false)

    useEffect(() => {
        if (!user.isAuth || user.user.role != 'ADMIN') {
            window.location.href = '/'
        }
        document.title = "Панель администратора"
        getStreets().then(data => setStreets(data))
        getCategories().then(data => setCategories(data))
        getProducts().then(data => setProducts(data))
    }, [])

    const clickStreets = () => {
        setLoadingStreets(true)
        getAikoStreets().then(data => {
            setStreets(data)
            setLoadingStreets(false)
            console.log(data)
        })
    }
    const clickCategories = () => {
        setLoadingCategories(true)
        getAikoCategories().then(data => {
            setCategories(data)
            setLoadingCategories(false)
            console.log(data)
        })
    }
    const clickProducts = () => {
        setLoadingProducts(true)
        getAikoProducts().then(data => {
            setProducts(data)
            setLoadingProducts(false)
            console.log(data)
        })
    }
    return (
        <div id="sec-13" className="admin-page container pb-5 pt-5">
            <div className="row">
                <div className="col-md-4 col-xl-3">
                    <Menu />
                </div>
                <div className="col-md-8 col-xl-9">
                    {
                        (id === 'categories') ?
                            <Categories />
                            : (id === 'notifications') ?
                                <Notifications />
                                : (id === 'products') ?
                                    <Products />
                                    : (id === 'orders') ?
                                        <Orders />
                                        : (id === 'sales') ?
                                            <Sales />
                                            :
                                            <>
                                                <h5>Панель администратора</h5>
                                                <div className="row admin-home">
                                                    <div className="col-6 mb-4">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="fw-6">Улицы доставки</div>
                                                                    <div>
                                                                        <button disabled={loadingStreets} className="btn btn-1" onClick={clickStreets}>{loadingStreets ? 'Загрузка...' : 'Выгрузить'}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="card-body">
                                                                {
                                                                    streets ?
                                                                        <div>Выгружено <b className="text-success">{streets.count}</b> улиц</div>
                                                                        : <div className="no-result"><div>Нет данных</div></div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 mb-4">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="fw-6">Категории</div>
                                                                    <div>
                                                                        <button disabled={loadingCategories} className="btn btn-1" onClick={clickCategories}>{loadingCategories ? 'Загрузка...' : 'Выгрузить'}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="card-body">
                                                                {
                                                                    categories ?
                                                                        <div>Выгружено <b className="text-success">{categories.count}</b> категорий</div>
                                                                        : <div className="no-result"><div>Нет данных</div></div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 mb-4">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="fw-6">Товары</div>
                                                                    <div>
                                                                        <button disabled={loadingProducts} className="btn btn-1" onClick={clickProducts}>{loadingProducts ? 'Загрузка...' : 'Выгрузить'}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="card-body">
                                                                {
                                                                    products ?
                                                                        <div>Выгружено <b className="text-success">{products.count}</b> товаров</div>
                                                                        : <div className="no-result"><div>Нет данных</div></div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Admin
import React, { useContext, useEffect, useState } from 'react'

import ProductList from "../components/ProductList"
import { HOME_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { useParams } from "react-router-dom"
import { fetchProducts, fetchCategoryOne } from "../http/productAPI"
import SwiperCore, { Navigation, Pagination } from 'swiper'
SwiperCore.use([Navigation, Pagination])

const Catalog = observer(() => {
    const { product } = useContext(Context)
    const { catalogId } = useParams()
    const [filter, setFilter] = useState('')
    const timeNow = new Date()

    const getData = () => {
        if (catalogId) {
            console.log(catalogId)
            fetchCategoryOne(catalogId).then(data => {
                if (data) {
                    document.title = data.category.title ? data.category.title : 'Каталог'
                    product.setSelectedCategory(data.category)
                }
            });
            fetchProducts(catalogId, 1, 40).then(data => {
                if (data) {
                    product.setProducts(data)
                    // product.setTotalCount(data.length)
                }
            })
        }
    }
    useEffect(() => {
        if (filter && filter.length > 0) {
            fetchProducts(catalogId, 1, 40, filter).then(data => {
                product.setProducts(data)
            })
        }
    }, [filter])

    useEffect(() => {
        document.title = "Каталог"
        getData();
    }, [])

    useEffect(() => {
        getData();
    }, [product.page, catalogId])

    return (
        <main>
            <section className="sec-2 mb-8">
                <div className="container">
                    {
                        ((timeNow.getHours() > 12 || timeNow.getHours() < 10) && catalogId == 5) ?
                            <section className="mt-5 mb-8">
                                <div className="row justify-content-center">
                                    <div className="col-md-7 col-lg-6 col-xl-5">
                                        <h3 className="text-center">Завтрак вы можете заказать с 10:00 до 12:00</h3>
                                        <Link to={HOME_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                                    </div>
                                </div>
                            </section>
                            : <>
                                <div className='d-lg-flex flex-lg-row-reverse align-items-center justify-content-between mt-5'>
                                    <div className='text-lg-end ms-lg-5 mb-3 mb-lg-0'>ГОТОВОЕ БЛЮДО МОЖЕТ ОТЛИЧАТЬСЯ ОТ БЛЮДА НА ФОТОГРАФИИ</div>
                                    <div className='ingredints-sort d-flex align-items-center flex-wrap'>
                                        <a onClick={() => setFilter('вегетарианское')} className={'me-2 me-lg-md-3 mb-2 ' + (filter == 'вегетарианское' ? 'active' : '')}>
                                            <img src='/images/icons/vegan.png' alt="вегетарианское" className='me-2' />
                                            вегетарианское
                                        </a>
                                        <a onClick={() => setFilter('рыбы')} className={'me-2 me-lg-md-3 mb-2 ' + (filter == 'рыбы' ? 'active' : '')}>
                                            <img src='/images/icons/seafood.png' alt="рыбы" className='me-2' />
                                            рыбы
                                        </a>
                                        <a onClick={() => setFilter('острое')} className={'me-2 me-lg-md-3 mb-2 ' + (filter == 'острое' ? 'active' : '')}>
                                            <img src='/images/icons/spicy.png' alt="острое" className='me-2' />
                                            острое
                                        </a>
                                        <a onClick={() => setFilter('курица')} className={'me-2 me-lg-md-3 mb-2 ' + (filter == 'курица' ? 'active' : '')}>
                                            <img src='/images/icons/chicken.png' alt="курица" className='me-2' />
                                            курица
                                        </a>
                                        <a onClick={() => setFilter('мясо')} className={'me-2 me-lg-md-3 mb-2 ' + (filter == 'мясо' ? 'active' : '')}>
                                            <img src='/images/icons/meat.png' alt="мясо" className='me-2' />
                                            мясо
                                        </a>
                                    </div>
                                </div>
                                <ProductList catalog={true} />
                            </>
                    }
                </div>
            </section>
        </main>
    );
});

export default Catalog;
import React, { useEffect, useState, useContext } from 'react'
import { Context } from "./../index"
import { observer } from "mobx-react-lite"
import Radio from "./../components/Radio"
import DopList from "./../components/DopList"
import { useParams } from 'react-router-dom'
import { fetchOneProduct } from "../http/productAPI"

const Product = observer(() => {
    const { productId } = useParams()
    const { cart, product } = useContext(Context)
    const [dop, setDop] = useState(false)
    const [btnAdd, setBtnAdd] = useState({ status: false, count: 1 })
    const [updateState, setUpdateState] = useState(false)

    useEffect(() => {
        if (productId) {
            fetchOneProduct(productId).then(data => {
                if (data) {
                    if (data.product.attribute[0]) {
                        setDop(data.product.attribute[0])
                    }
                    document.title = data.product.title ? data.product.title : 'Товар'
                    product.setProduct(data.product)
                }
            })
        }
    }, [])

    const addCart = () => {
        cart.setCart(product.product)
        setBtnAdd(cart.checkCart(product.product))
    }
    const plusCount = () => {
        cart.setCartCountPlus(product.product)
        setUpdateState(!updateState)
    }
    const minusCount = () => {
        cart.setCartCountMinus(product.product)
        setUpdateState(!updateState)
    }

    return (
        <main>
            <div className='container pt-5 pb-5'>
                {
                    product ?
                        <div className="short-info row">
                            <div className="col-md-5">
                                <div className="img-prod mb-5 mb-md-0">
                                    {(product.product.image) ? <img className="w-100" src={process.env.REACT_APP_API_URL + '/products/' + product.product.image} alt={product.product.title} /> : null}
                                </div>
                            </div>
                            <div className="col-md-7">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h1 className="h2 fw-6 mb-0 text-left">{product.product.title}</h1>
                                    <div className="dropdown">
                                        <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src="/images/icons/info2.svg" alt="" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-full-content dropdown-menu-end p-3 ">
                                            <div className="fs-09 mb-1">Пищевая ценность на 100 г</div>
                                            {
                                                (product.product && product.product.tags) &&
                                                JSON.parse(product.product.tags).map(item => (
                                                    <div className="d-flex justify-content-between fs-09 mb-1">
                                                        <span className="fw-5">{item.title}</span>
                                                        <span>{Math.round(item.value)} г</span>
                                                    </div>
                                                ))
                                            }
                                            <hr />
                                            <div className="d-flex justify-content-between fs-09 mb-1">
                                                <span className="fw-5">Вес</span>
                                                <span>{Math.round(Number(product.product.weight) * 1000)} г</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-secondary fs-14 mb-4"><span className="me-2">{(product.product.mini_description) ? product.product.mini_description : (product.product.description) ? product.product.description : 'Нет состава'}</span></div>
                                <div className="d-flex flex-row justify-content-between align-items-center">
                                    {
                                        (product.product.attribute && product.product.attribute[1]) && <Radio />
                                    }
                                    <div className="sec-font mb-3">
                                        <div className="fs-20 fw-5">{product.product.price} ₽</div>
                                        {(product.product.sale > 0) && <div className="gray-3 text-decoration-line-through align-middle me-1 me-md-0 ms-1">{product.product.sale} ₽</div>}
                                    </div>
                                </div>
                                {
                                    (dop && dop.length > 0) ?
                                        <>
                                            <h5 className="fw-6">Дополнительные ингредиенты:</h5>
                                            <div className="dop-scroll">
                                                <DopList product={product.product} dop={dop} />
                                            </div>
                                        </>
                                        : <div className="dop-scroll"></div>
                                }
                                <div className="d-flex flex-row align-items-center  mt-4">
                                    <div className="d-none d-md-flex justify-content-between align-items-center">
                                        <button type="button" onClick={addCart} className="btn btn-1 fs-12 px-4 px-sm-5">{(btnAdd.status) ? 'Добавлено' : 'В корзину'}</button>
                                    </div>
                                    <div className="position-fixed d-md-none py-3">
                                        <button type="button" onClick={addCart} className="btn btn-1 w-100 fs-12 px-4 px-sm-5">{(btnAdd.status) ? 'Добавлено за ' + product.product.price + '₽' : 'В корзину за ' + product.product.price + '₽'}</button>
                                    </div>
                                    {
                                        cart.getCartProductCount(product.product) ?
                                            <div className="input-box ms-3">
                                                <button type="button" onClick={() => minusCount(product.product)}>
                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5 12H19" />
                                                    </svg>
                                                </button>
                                                <input type="number" placeholder="1" value={cart.getCartProductCount(product.product)} min={1} className="fs-12 fw-5" readOnly={true} />
                                                <button type="button" onClick={() => plusCount(product.product)}>
                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 4.99992V18.9999" />
                                                        <path d="M5 12H19" />
                                                    </svg>
                                                </button>
                                            </div>
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                        : <div className="loading loading-absolute"><img src="/images/loader.png" /></div>
                }
            </div>
        </main >
    )
})

export default Product

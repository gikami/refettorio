import React, { useContext, useState } from 'react'
import { Context } from "../index"
import { Link } from "react-router-dom"
import { CHECKOUT_ROUTE } from "../utils/consts"
import { observer } from "mobx-react-lite"

const CartContent = observer(({ type }) => {
    const { user, cart, favorite } = useContext(Context)
    const [updateState, setUpdateState] = useState(false)

    const plusCount = (product) => {
        cart.setCartCountPlus(product)
        setUpdateState(!updateState)
    }
    const minusCount = (product) => {
        cart.setCartCountMinus(product)
        setUpdateState(!updateState)
    }
    const changeCount = ({ product, num }) => {
        cart.setCartCount(product, num)
        setUpdateState(!updateState)
    }
    const removeProduct = (product) => {
        cart.removeCartProduct(product)
        setUpdateState(!updateState)
    }
    const removeDop = (product, dop) => {
        cart.removeCartDop(product, dop)
        setUpdateState(!updateState)
    }
    const removeAllProduct = (product) => {
        cart.removeAllCart(product)
        setUpdateState(!updateState)
    }
    // const addGift = (id) => {
    //     cart.addGift(id)
    //     setUpdateState(!updateState)
    // }
    // useEffect(() => {
    //     if (cart.total < cart.giftMinPrice[0]) {
    //         Object.keys(cart.cart).find(ids => (cart.cart[ids] && cart.cart[ids].gift) && addGift(0));
    //     }
    //     if (cart.total < cart.giftMinPrice[1]) {
    //         Object.keys(cart.cart).find(ids => (cart.cart[ids] && cart.cart[ids].gift) && addGift(1));
    //     }
    //     if (user.isAuth && user.user.order) {
    //         Object.keys(cart.cart).find(ids => (cart.cart[ids] && cart.cart[ids].gift) && addGift(2));
    //     }
    // }, [updateState])

    if (type == 'mini') {
        return (
            (cart.cart && cart.cart.length > 0) ?
                cart.cart.map((cart, i) => {
                    var total = cart.price * cart.amount
                    if (cart.dop) {
                        cart.dop.map(dop => total += dop.price)
                    }
                    return (
                        <div key={i} className="item p-3">
                            <div className="d-flex align-items-center">
                                <img src={process.env.REACT_APP_API_URL + "/products/" + cart.image} alt={cart.title} className="me-3" />
                                <div className="row w-100">
                                    <div className="col">
                                        <div className="text">
                                            <div className="title">{cart.title}</div>
                                            <div className="ingredients">{cart.description}</div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <button type="button" className="btn-del ms-3" onClick={() => removeProduct(cart)}>
                                            <img src="/images/icons/delete.svg" alt="удалить" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-end mt-2">
                                {/* <div className="d-flex align-items-center flex-grow-1">
                                    <button className="btn-mini" type="button" onClick={() => minusCount(cart)}>
                                        <svg width="9" height="2" viewBox="0 0 9 2" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.875 1.625H0.125V0.375H8.875V1.625Z" fill="#323232" />
                                        </svg>
                                    </button>
                                    <input type="number" placeholder="0" value={cart.amount} onChange={() => changeCount(cart)} readOnly={true} />
                                    <button className="btn-mini" type="button" onClick={() => plusCount(cart)}>
                                        <svg width="9" height="10" viewBox="0 0 9 10" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M8.875 5.625H5.125V9.375H3.875V5.625H0.125V4.375H3.875V0.625H5.125V4.375H8.875V5.625Z"
                                                fill="#454545" />
                                        </svg>
                                    </button>
                                </div> */}
                                <div className="text-end sec-font fs-11 fw-5 ms-3">
                                    {total} ₽
                                </div>
                            </div>
                            {
                                (cart.dop && cart.dop.length > 0) && <div className="flex-wrap product-dop d-flex mt-2"> {
                                    cart.dop.map(dop => (
                                        <div className='product-dop-box d-flex justify-content-between align-items-center'>
                                            <div className='flex-1 fs-10'>{dop.title} <span className='fw-5'>{dop.price} ₽</span></div>
                                            <div className="ms-2">
                                                <button type="button" className="btn-del" onClick={() => removeDop(cart, dop)}>
                                                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M25 24.9706L8.02944 8.00002" stroke="#666666" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M8 24.9706L24.9706 8.00002" stroke="#666666" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                            }

                        </div>
                    )
                })
                : <div className="pb-4 pt-4 text-center">Корзина пуста</div>
        )
    } else if (type == 'checkout') {
        return (
            (cart.cart && cart.cart.length > 0) ?
                <div className="table-resposive">
                    <table className="table table-borderless mb-0 title-font fw-6">
                        <tbody>
                            {
                                cart.cart.map((cart, i) => {
                                    var param = (cart.param) ? JSON.parse(cart.param)[0] : false
                                    var total = cart.price * cart.amount
                                    if (cart.dop) {
                                        cart.dop.map(dop => total += dop.price)
                                    }
                                    return (
                                        <>
                                            <tr>
                                                <td width="55">
                                                    <img src={process.env.REACT_APP_API_URL + "/products/" + cart.image} alt={cart.title} className="w-100 me-3" />
                                                </td>
                                                <td>
                                                    <div>{cart.title}{
                                                        (cart.size) && <small className="ms-2">{cart.size.title}</small>
                                                    }</div>
                                                    <div className="gray-3 fs-10 fw-2">{(cart.amount) ? cart.amount : 1} шт</div>
                                                </td>
                                                <td>
                                                    <div className="gray-1 fs-12 text-end">{total} ₽</div>
                                                </td>
                                            </tr>
                                            {
                                                (cart.dop && cart.dop.length > 0) &&
                                                cart.dop.map(dop => (
                                                    <tr className="table-dop">
                                                        <td className="pt-0"></td>
                                                        <td className="pt-0">
                                                            <div className="primary fw-light"><small>{dop.title}</small></div>
                                                        </td>
                                                        <td className="pt-0">
                                                            <div className="gray-1 fs-12 text-end fw-light"><small>{dop.price} ₽</small></div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    )
                                })

                            }
                        </tbody>
                    </table>
                </div>
                : <div className="pb-4 pt-4 text-center">Корзина пуста</div>
        )

    } else {
        return (
            <div className="gx-xxl-5">
                <div className="d-flex justify-content-center justify-content-md-end">
                    <button type="button" className="gray-3 me-md-0 mb-4" onClick={removeAllProduct}>Очистить корзину</button>
                </div>
                {
                    cart.cart.map((cart, i) => {
                        var total = cart.price * cart.amount
                        if (cart.dop) {
                            cart.dop.map(dop => total += dop.price)
                        }
                        return (
                            <div key={i} className="d-md-flex justify-content-between align-items-center item mb-4">
                                <div className="d-flex w-100 align-items-center">
                                    <div className="img">
                                        <img src={process.env.REACT_APP_API_URL + '/products/' + cart.image} alt={cart.title} />
                                    </div>
                                    <div className="text w-100 ms-3 ms-md-4 d-block d-md-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <h5 className="mb-0 mb-md-2">{cart.title}
                                                        {
                                                            (cart.size) && <small className="ms-2">{cart.size.title}</small>
                                                        }
                                                        {/*
                                                        (param && param.gramm) && <small className="ms-2">{cart.weight * 1000} г</small>
                                                        */
                                                        }
                                                    </h5>
                                                </div>
                                                <div className="col-auto d-flex d-md-none">
                                                    <button type="button" className="btn-del" onClick={() => removeProduct(cart)}>
                                                        <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.14286 17.5556C1.14286 18.7429 2.17143 19.7143 3.42857 19.7143H12.5714C13.8286 19.7143 14.8571 18.7429 14.8571 17.5556V4.60317H1.14286V17.5556ZM16 1.36508H12L10.8571 0.285713H5.14286L4 1.36508H0V3.52381H16V1.36508Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="ingredients">{cart.description}</div>
                                            {
                                                (cart.dop && cart.dop.length > 0) && <div className="flex-wrap product-dop d-flex mt-2"> {
                                                    cart.dop.map(dop => (
                                                        <div className='product-dop-box d-flex justify-content-between align-items-center'>
                                                            <div className='flex-1 fs-10'>{dop.title} <span className='fw-5'>{dop.price} ₽</span></div>
                                                            <div className="ms-2">
                                                                <button type="button" className="btn-del" onClick={() => removeDop(cart, dop)}>
                                                                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M25 24.9706L8.02944 8.00002" stroke="#666666" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                                                        <path d="M8 24.9706L24.9706 8.00002" stroke="#666666" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                </div>
                                            }
                                        </div>
                                        <div className="btns d-flex align-items-center justify-content-between">
                                            {!cart.gift &&
                                                <div className="input-box">
                                                    <button type="button" onClick={() => minusCount(cart)}>
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5 12H19" />
                                                        </svg>
                                                    </button>
                                                    <input type="number" placeholder="1" value={cart.amount} min={1} className="fs-12 fw-5" readOnly={true} />
                                                    <button type="button" onClick={() => plusCount(cart)}>
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 4.99992V18.9999" />
                                                            <path d="M5 12H19" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            }
                                            {/* {cart.sale && cart.sale > 0 ? <span className="gray-3 text-decoration-line-through ms-3">{cart.sale} ₽</span> : null} */}
                                            <div className="mx-md-5 sec-font fs-15 fw-6">{total} ₽</div>
                                            <button type="button" className="btn-del d-none d-md-inline-block" onClick={() => removeProduct(cart)}>
                                                <svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.14286 17.5556C1.14286 18.7429 2.17143 19.7143 3.42857 19.7143H12.5714C13.8286 19.7143 14.8571 18.7429 14.8571 17.5556V4.60317H1.14286V17.5556ZM16 1.36508H12L10.8571 0.285713H5.14286L4 1.36508H0V3.52381H16V1.36508Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })

                }
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <Link to={CHECKOUT_ROUTE} className="btn btn-2 d-none d-md-flex">
                        Вернуться меню
                    </Link>

                    <div className="mb-4 mb-lg-0 d-none d-md-block">
                        {
                            (cart.sale.total > 0) &&
                            <div className="fs-14 text-end">
                                <small>{cart.sale.text ? cart.sale.text : 'Скидка: '}</small>
                                <span className="primary ms-2">-{cart.sale.total} ₽</span>
                            </div>
                        }
                        <div className="fs-14 text-end">
                            К оплате:<span className="fw-6 fs-14 ms-3">{(cart.total) ? cart.total : 0} ₽</span>
                        </div>
                        <div className="mt-3 d-block d-md-flex justify-content-end">
                            <Link to={CHECKOUT_ROUTE} className="btn btn-1">Оформить заказ</Link>
                        </div>
                    </div>
                    <div className="mb-4 mb-lg-0 d-block d-md-none">
                        <Link to={CHECKOUT_ROUTE} className="btn btn-1 py-3 fs-13 mt-3">Оформить заказ за {(cart.total) ? cart.total : 0} ₽</Link>
                        <Link to={CHECKOUT_ROUTE} className="btn btn-2 py-3 fs-13 mt-3">Вернуться меню</Link>
                    </div>
                </div>
            </div>
        )
    }
})

export default CartContent
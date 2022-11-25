import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { HOME_ROUTE, CHECKOUT_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"
import CartContent from "../components/Cart"
import RecommendList from "../components/RecommendList"
import { fetchRecommed } from "../http/productAPI"
import { observer } from "mobx-react-lite"

const Cart = observer(() => {
    const { cart } = useContext(Context)
    const [recommend, setRecommend] = useState(false)

    useEffect(() => {
        document.title = "Корзина"
        fetchRecommed().then(data => {
            if (data) {
                setRecommend(data.recommend)
            }
        }).catch(e => console.log(e))
    }, [])

    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-14" className="mb-8">
                <div className="container">
                    {
                        (cart.cart && cart.cart.length > 0) ?
                            <>
                                <h1 className="inner text-center text-md-start">Корзина</h1>
                                <form>
                                    <CartContent />
                                </form>
                                {
                                    recommend && recommend.length > 0 && <>
                                        <h3 className="fw-7 mb-3 mt-4">Вам может понравится</h3>
                                        <RecommendList list={recommend} />
                                    </>
                                }
                            </>
                            :
                            <div className="gx-xxl-5">
                                <img src="/images/no-card.svg" alt="" className="d-block mx-auto mb-4" />
                                <h1 className="text-center mb-4">Корзина пуста</h1>
                                <div className="sec-font text-center mb-4">Добавьте сюда понравившиеся товары</div>
                                <Link to={HOME_ROUTE} className="btn btn-1 mx-auto mb-5">В каталог</Link>
                            </div>
                    }
                </div>
            </section>
        </main>
    )
})

export default Cart

import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { HOME_ROUTE, CART_ROUTE, PROFILE_ROUTE, DELIVERY_ROUTE, POLICY_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { setOrder, getStreets } from "../http/orderAPI"
import { getAddress } from "../http/userAPI"
import CartContent from "../components/Cart"
import InputMask from 'react-input-mask'
import { NotificationManager } from 'react-notifications'
import { NavDropdown } from "react-bootstrap"

const Checkout = observer(() => {
    const { user, cart } = useContext(Context)
    const [sendOrder, setSendOrder] = useState(false)
    const [sendLoading, setSendLoading] = useState(false)
    const [streets, setStreets] = useState(false)
    const timeNew = new Date()
    const timeNow = new Date()
    const dateNow = new Date().toISOString().substring(0, 10)
    timeNew.setTime(timeNew.getTime() + 90 * 60 * 1000)
    const time = timeNew.getHours() + ':' + (timeNew.getMinutes() < 10 ? '0' : '') + timeNew.getMinutes()
    const localAddress = localStorage.getItem('address')
    const [address, setAddress] = useState((localAddress) ? localAddress : 'Казань, ул. Театральная д.3')
    const [getAddressArray, setGetAddressArray] = useState()
    const [checkout, setCheckout] = useState({
        name: (user.isAuth && user.user.firstname) ? user.user.firstname : '',
        phone: (user.isAuth && user.user.phone) ? user.user.phone : '',
        email: (user.isAuth && user.user.email) ? user.user.email : '',
        user: (user.isAuth) ? user.user.id : '',
        point: 0,
        time: 1,
        timevalue: time,
        datevalue: dateNow,
        payment: 'card',
        delivery: 1,
        total: cart.total,
        products: cart.cart,
        full: '', streetId: '', street: '', home: '', entrance: '', code: '', floor: '', apartment: '',
        address: '',
        terminalAddress: address ? address : false,
        saveaddress: true,
        comment: '',
        person: 1,
        sale: cart.sale
    })

    useEffect(() => {
        document.title = "Оформление заказа"
        getStreets().then(data => {
            setStreets(data);
            if (user && user.user) {
                getAddress(user.user.id).then(e => {
                    if (e && e.data) {
                        setGetAddressArray(e.data)
                        if (e.data[0]) {
                            let streetId = data.rows.find(street => street.title.trim() === e.data[0].street.trim() && street)
                            setCheckout({ ...checkout, address: e.data[0], streetId: streetId.apiId })
                        }
                    }
                })
            }
        });
    }, [])

    const addLocalAddress = (e) => {
        setAddress(e.target.innerText)
        localStorage.setItem('address', e.target.innerText)
    }
    const updateTotal = () => {
        if ((cart.total < cart.deliveryMinPrice || cart.total < cart.deliveryMinDelivery) && checkout.delivery == 2) {
            checkout.total = cart.total + cart.deliveryPrice
        } else {
            checkout.total = cart.total
        }
        setCheckout({ ...checkout, total: checkout.total })
    }
    useEffect(() => {
        updateTotal()
    }, [checkout.delivery, cart.total])

    const submit = async (e) => {
        e.preventDefault()
        setSendLoading(true)

        if (checkout.delivery == 2 && (!checkout.address || !checkout.address.id)) {
            if (checkout.street.length < 1) {
                NotificationManager.error('Заполинте поле Улица')
                setSendLoading(false)
                return
            }
            if (checkout.home.length < 1) {
                NotificationManager.error('Заполинте поле Дом')
                setSendLoading(false)
                return
            }
            if (checkout.apartment.length < 1) {
                NotificationManager.error('Заполинте поле Квартира')
                setSendLoading(false)
                return
            }
        }
        if (checkout.name.length < 1) {
            NotificationManager.error('Заполинте поле Имя')
            setSendLoading(false)
            return
        }
        if (checkout.phone.length < 1) {
            NotificationManager.error('Заполинте поле Номер телефона')
            setSendLoading(false)
            return
        }
        let data = await setOrder(checkout).catch(info => setSendLoading(false))

        if (data && data.data && data.data.formUrl) {
            setSendOrder({ status: 2, link: data.data.formUrl })
            cart.removeAllCart()
            setCheckout([])
            window.location = data.data.formUrl
        } else if (data && data.status) {
            setSendOrder({ status: 1 })
            cart.removeAllCart()
        } else {
            NotificationManager.error(data.message ? data.message : 'Произошла неизвестная ошибка, повторите попытку позже')
        }
        setSendLoading(false)
    }
    const change = (e) => {
        if (e.target.name === 'address') {
            let streetId = streets.rows.find(street => street.title.trim() === getAddressArray[e.target.value].street.trim() && street)
            setCheckout({ ...checkout, [e.target.name]: getAddressArray[e.target.value], streetId: streetId ? streetId.apiId : null })
        } else if (e.target.name === 'saveaddress') {
            setCheckout({ ...checkout, [e.target.name]: e.target.checked })
        } else if (e.target.name === 'street') {
            let streetId = streets.rows.find(street => street.title === e.target.value && street)
            if (streetId) {
                setCheckout({ ...checkout, [e.target.name]: e.target.value, streetId: streetId.apiId })
            }
        } else if (e.target.name === 'time') {
            setCheckout({ ...checkout, 'time': Number(e.target.value) })
        } else {
            setCheckout({ ...checkout, [e.target.name]: e.target.value })
        }
    }


    if (sendOrder && sendOrder.status == 1) {
        return (
            <main className='pt-4 pt-lg-5'>
                <section className="mt-5 mb-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <h2 className="text-center">Заявка успешно отправлена!</h2>
                                <div className="text-center mb-4 mb-sm-5">Ожидайте звонка оператора от 2 до 15 минут. Мы свяжемся с вами для подтверждения заказа. Если вы не получили ответа, просим позвонить по телефону +7 (843) 292-0-292 (Казань, ул. Театральная д.3)</div>
                                <Link to={HOME_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    } else if (sendOrder && sendOrder.status == 2) {
        return (
            <main className='pt-4 pt-lg-5'>
                <section className="mt-5 mb-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <h2 className="text-center">Отправляемся к форме оплаты...</h2>
                                <p>Если в течении 5 секунд перенаправление не произошло, нажмите кнопку "Перейти к форме"</p>
                                <a href={sendOrder.link} className="btn btn-2 mx-auto py-md-3">Перейти к форме</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
    return (
        <main className='pt-4 pt-lg-5'>
            {
                (timeNow.getHours() === 23 || timeNow.getHours() < 10) ?
                    <section className="mb-8">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-md-7 col-lg-6 col-xl-5">
                                    <h3 className="text-center">Мы работаем пн-вс с 10:00 до 23:00</h3>
                                    <div className="text-center mb-4 mb-sm-5">Вы можете пока собрать свой заказ в корзине и когда мы откроемся, оформить заказ.</div>
                                    <Link to={HOME_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <section id="sec-14" className="mb-8">
                        <div className="container">
                            <form onSubmit={submit} className="mb-4 mb-sm-5">
                                <h1>Оформление заказа</h1>
                                <div className="row justify-content-between gx-4 gx-xl-5">
                                    <div className="col-md-7 col-xl-8 col-xxl-7">
                                        <div className="row mb-3">
                                            <label className="col-sm-2 col-form-label">Имя:</label>
                                            <div className="col-sm-10">
                                                <input type="text" placeholder="Ваше имя" name="name" defaultValue={checkout.name} onChange={change} className="mb-3" />
                                            </div>
                                            <label className="col-sm-2 col-form-label">Телефон:</label>
                                            <div className="col-sm-10">
                                                <InputMask mask="+7 999 999 99 99" placeholder="+7 000 000 00 00" name="phone" maskChar="" defaultValue={checkout.phone} onChange={change} className="mb-3" />
                                            </div>
                                            <label className="col-sm-2 col-form-label">Email:</label>
                                            <div className="col-sm-10">
                                                <input type="email" placeholder="Email (Необязательно)" name="email" defaultValue={checkout.email} onChange={change} className="mb-3" />
                                                <small>Для получения письма с деталями заказа</small>
                                            </div>
                                        </div>
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Способ получения заказа:</legend>
                                            <div>
                                                <div className="switch fs-11 mb-4">
                                                    <a className={checkout.delivery === 1 ? "switch-option fw-6 active" : "switch-option fw-6"} onClick={() => setCheckout({ ...checkout, delivery: 1 })}>Самовывоз</a>
                                                    <a className={checkout.delivery === 2 ? "switch-option fw-6 active" : "switch-option fw-6"} onClick={() => setCheckout({ ...checkout, delivery: 2 })}>Доставка</a>
                                                </div>

                                                {checkout.delivery === 1 ?
                                                    <div className="row g-2 g-lg-3 sec-font pl-2 pr-2 pt-2">
                                                        <NavDropdown
                                                            title={address}
                                                            className="fw-6 fs-11 address-menu"
                                                        >
                                                            <NavDropdown.Item onClick={addLocalAddress} active={(address == 'Казань, ул. Театральная д.3') ? true : false}>Казань, ул. Театральная д.3</NavDropdown.Item>
                                                        </NavDropdown>
                                                        <div className="col-12">
                                                            <div className="gray-1 mb-2">Комментарий</div>
                                                            <textarea rows="3" name="comment" placeholder="Комментарий к заказу" onChange={change} value={checkout.comment}></textarea>
                                                        </div>
                                                    </div>
                                                    :
                                                    (user.isAuth && getAddressArray && getAddressArray.length > 0) ?
                                                        <>
                                                            <div className="fs-09 gray-1 mb-4">Выберите адрес для доставки по умолчанию.</div>
                                                            {
                                                                getAddressArray.map((item, i) =>
                                                                    <div key={i} className="d-flex align-items-start mb-4">
                                                                        <input type="radio" name="address" value={i} id={"address-" + i} onClick={change} defaultChecked={(i === 0) ?? true} />
                                                                        <div className="ms-2">
                                                                            <label for={"address-" + i} className="gray-1 fw-5">{(item.name) ? item.name : item.street}</label>
                                                                            <div className="d-flex mt-2">
                                                                                <Link to={PROFILE_ROUTE + '/address/edit/' + item.id} className="fs-09 gray-4">Редактировать</Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }

                                                            <Link to={PROFILE_ROUTE + '/address/add'} className="d-flex align-items-center">
                                                                <img src="/images/icons/plus3.svg" alt="Добавить" className="me-2" />
                                                                <span className="primary">Добавить адрес</span>
                                                            </Link>
                                                            <div className="col-12 mt-3">
                                                                <div className="gray-1 mb-2">Комментарий</div>
                                                                <textarea rows="3" name="comment" placeholder="Комментарий к заказу" onChange={change} value={checkout.comment}></textarea>
                                                            </div>
                                                        </>
                                                        :
                                                        <div className="row g-2 g-lg-3 sec-font">
                                                            <div className="col-sm-10">
                                                                <div className="gray-1 mb-2">Улица <span className="text-danger">*</span></div>
                                                                <input type="text" list="streets" onChange={change} onKeyUp={change} name="street" autoComplete="off" placeholder="Улица" />
                                                                <datalist id="streets">
                                                                    {
                                                                        (streets) ?
                                                                            streets.rows.map((item, key) =>
                                                                                <option key={key} value={item.title} />
                                                                            )
                                                                            : <option key={0} value="Введите улицу" />
                                                                    }
                                                                </datalist>
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="gray-1 mb-2">Дом <span className="text-danger">*</span></div>
                                                                <input type="text" name="home" placeholder="Дом" onChange={change} value={checkout.home} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div className="gray-1 mb-2">Квартира <span className="text-danger">*</span></div>
                                                                <input type="text" name="apartment" placeholder="Квартира" onChange={change} value={checkout.apartment} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div className="gray-1 mb-2">Подъезд</div>
                                                                <input type="text" name="entrance" placeholder="Подъезд" onChange={change} value={checkout.entrance} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div className="gray-1 mb-2">Этаж</div>
                                                                <input type="text" name="floor" placeholder="Этаж" onChange={change} value={checkout.floor} />
                                                            </div>
                                                            <div className="col-3">
                                                                <div className="gray-1 mb-2">Код двери</div>
                                                                <input type="text" name="code" placeholder="Код двери" onChange={change} value={checkout.code} />
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="gray-1 mb-2">Комментарий</div>
                                                                <textarea rows="3" name="comment" placeholder="Комментарий к заказу" onChange={change} value={checkout.comment}></textarea>
                                                            </div>
                                                            {
                                                                (user.isAuth) ?
                                                                    <div className="col-12">
                                                                        <div className="d-flex align-items-center">
                                                                            <input type="checkbox" name="saveaddress" id="save-address" checked={checkout.saveaddress} onChange={change} />
                                                                            <label for="save-address" className="ms-3">Сохранить адрес доставки в личном кабинете</label>
                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            }

                                                        </div>
                                                }
                                            </div>
                                        </fieldset>
                                        <fieldset className="mb-3 mb-sm-4">
                                            <legend className="title-font gray-1 fs-15 fw-7 mb-3">Заказать ко времени:</legend>
                                            <div className="sec-font">
                                                <div className="d-flex align-items-center mb-2">
                                                    <input type="radio" name="time" value={1} id="sooner" onClick={change} defaultChecked />
                                                    <label for="sooner" className="flex-1 ms-2">Как можно скорее</label>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <input type="radio" name="time" value={2} onClick={change} id="in-time" />
                                                    <label for="in-time" className="ms-2">К назначенному времени </label>
                                                    {/* <input type="date" name="datevalue" className="ms-2 w-fit py-2" onChange={change} defaultValue={dateNow} /> */}
                                                    <input type="time" name="timevalue" className="ms-2 w-fit py-2" onChange={change} defaultValue={time} />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className="d-flex mb-3 mb-sm-4 flex-row align-items-center">
                                            <div class="fs-15 fw-7 me-3">Количество персон:</div>
                                            <div className="sec-font">
                                                <div className="d-flex align-items-center">
                                                    <input type="number" name="person" min={1} max={100} defaultValue={1} onClick={change} id="in-time" />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="row">
                                            <fieldset className="col-md-6">
                                                <legend className="title-font gray-1 fs-15 fw-7 mb-3">Способ оплаты:</legend>
                                                <div className="sec-font">
                                                    <div>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <input type="radio" name="payment" value="card" id="card" onClick={change} />
                                                            <label for="card" className="ms-2">Банковской картой {checkout.delivery == 1 ? 'в заведении' : 'курьеру'}</label>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <input type="radio" name="payment" value="cash" onClick={change} id="cash" />
                                                            <label for="cash" className="ms-2">Наличными</label>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <input type="radio" name="payment" value="alfa" onClick={change} id="alfa" defaultChecked />
                                                            <label for="alfa" className="ms-2">Онлайн оплата</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            {/* {
                                                user.isAuth &&
                                                <fieldset className="col-md-6">
                                                    <legend className="title-font gray-1 fs-15 fw-7 mb-3">Оплата баллами</legend>
                                                    <p className="mb-2">У вас {user.user.point} баллов</p>
                                                    {
                                                        user.user.point > 0 &&
                                                        <div className="d-flex align-items-center">
                                                            <input type="number" name="point" min={0} max={user.user.point} defaultValue={0} onKeyUp={change} onChange={change} />
                                                        </div>
                                                    }
                                                </fieldset>

                                            } */}
                                        </div>
                                    </div>
                                    <div className="col-md-5 col-xl-4 position-relative">
                                        {/*<div className="bonus">
                                            <div className="gray-1 title-font fw-7 fs-12 lh-15 text-center">При заказе от 700₽ - доставим бесплатно!<br /><Link className="text-success" to={DELIVERY_ROUTE}>Подробнее о доставке</Link></div>
                                        </div>*/}
                                        <div className="checkout-box cart-preview">
                                            <div className="mb-4">
                                                <div className="title-font gray-1 fs-15 fw-6 mb-3">Ваш заказ:</div>
                                                <div className="cart-scroll">
                                                    <CartContent type="checkout" />
                                                </div>
                                            </div>
                                            <div>
                                                <table className="table table-borderless title-font">
                                                    <tbody>
                                                        <tr className="fs-12">
                                                            <td className="fw-5">Сумма заказа</td>
                                                            <td className="fw-6 text-end">{cart.total + ((cart.sale.total) ? cart.sale.total : 0)} ₽</td>
                                                        </tr>
                                                        {
                                                            (cart.sale.total > 0) &&
                                                            <tr className="fs-12">
                                                                <td><small>{cart.sale.text ? cart.sale.text : 'Скидка: '}</small></td>
                                                                <td className="fw-6 text-end">-{cart.sale.total} ₽</td>
                                                            </tr>
                                                        }
                                                        <tr className="fs-12">
                                                            <td className="fw-5">Доставка</td>
                                                            <td className="fw-6 text-end">{((cart.total < cart.deliveryMinPrice || cart.total < cart.deliveryMinDelivery) && checkout.delivery == 2) ? cart.deliveryPrice + ' ₽' : 'Бесплатно'}</td>
                                                        </tr>
                                                        <tr className="fw-7">
                                                            <td className="fs-12">Итого к оплате</td>
                                                            <td className="fs-16 text-end">{(checkout.total) ? checkout.total : 0} ₽</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {
                                                    cart.deliveryMinPrice > (cart.total + (cart.sale.total ? cart.sale.total : 0)) && checkout.delivery == 2 &&
                                                    <div className="text-danger text-center">Минимальная сумма заказа {cart.deliveryMinPrice}₽</div>
                                                }
                                                {
                                                    cart.deliveryMinDelivery > (cart.total + (cart.sale.total ? cart.sale.total : 0)) && checkout.delivery == 2 &&
                                                    <div className="text-secondary text-center">Добавьте товаров до {cart.deliveryMinDelivery}₽ и доставка будет бесплатной</div>
                                                }
                                                {/* <div className="text-danger text-center">Временно сделать заказ невозможно. Ведутся профилактические работы на сайте.</div> */}
                                                <button disabled={(cart.cart && cart.cart.length > 0 && checkout.name && checkout.name.length >= 1 && checkout.phone && checkout.phone.length >= 11 && !sendLoading && (cart.deliveryMinPrice < (cart.total + (cart.sale.total ? cart.sale.total : 0)) || checkout.delivery == 1)) ? false : true} type="submit" className="btn btn-1 mt-3 w-100 fs-11">{sendLoading ? 'Отправка заявки...' : 'Оформить заказ'}</button>
                                            </div>
                                        </div>
                                        <div className="text-center fs-10 gray-3 mt-3">Нажимая "Оформить заказ", Вы соглашаетесь с <Link className="text-success" to={POLICY_ROUTE}>Политикой конфиденциальности</Link></div>
                                    </div>
                                </div>
                            </form>
                            <Link to={CART_ROUTE} className="btn btn-2 mb-4">
                                <span className="ms-2">Вернуться в корзину</span>
                            </Link>
                        </div>
                    </section>
            }
        </main>
    )
})

export default Checkout

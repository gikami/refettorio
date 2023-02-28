import React, { useContext, useState } from 'react'
import { Context } from "../index"
import { Link, NavLink } from "react-router-dom"
import { HOME_ROUTE, PROFILE_ROUTE, DELIVERY_ROUTE, ABOUT_ROUTE, POLICY_ROUTE, CART_ROUTE, FAVORITES_ROUTE, TERMS_ROUTE, OFFER_ROUTE, SALE_ROUTE, VACANCY_ROUTE } from "../utils/consts"
import { observer } from "mobx-react-lite"
import { login, registration, newPassword } from "../http/userAPI"
import InputMask from 'react-input-mask'
import { NotificationManager } from 'react-notifications'
import { NavDropdown } from "react-bootstrap"

const Footer = observer(() => {
    const { user, cart, product } = useContext(Context)
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistarion, setIsRegistarion] = useState(false)
    const [isNewPassword, setIsNewPassword] = useState(false)
    const [viewPass, setViewPass] = useState(false)
    const viewPassword = () => setViewPass(!viewPass)
    const formLogin = async (e) => {
        try {
            e.preventDefault()
            if (!phone || phone.length < 10 || !password || password.length < 4) {
                NotificationManager.error('Введите номер телефона и пароль')
                return;
            }
            let data = await login(phone, password)

            if (data) {
                NotificationManager.success('Вы успешно авторизовались')
                user.setUser(data)
                user.setIsAuth(true)
                window.location.reload()
            } else {
                NotificationManager.error('Неверно введен номер телефона или пароль')
            }
        } catch (e) {
            NotificationManager.error(e.response.data.message)
        }
    }
    const formReg = async (e) => {
        try {
            e.preventDefault()
            if (!phone || phone.length < 10) {
                NotificationManager.error('Введите номер телефона')
                return;
            }
            let data = await registration(phone)
            if (data) {
                setIsRegistarion(true)
            } else {
                NotificationManager.error('Неверно введен номер телефона или пароль')
            }
        } catch (e) {
            NotificationManager.error(e.response.data.message)
        }
    }
    const formNewPassword = async (e) => {
        try {
            e.preventDefault()
            if (!phone || phone.length < 10) {
                NotificationManager.error('Введите номер телефона')
                return;
            }
            let data = await newPassword(phone)

            if (data) {
                setIsNewPassword(true)
            } else {
                NotificationManager.error('Такого пользователя не существует')
            }
        } catch (e) {
            console.log(e.response.data)
            NotificationManager.error(e.response.data.message)
        }
    }

    const localAddress = localStorage.getItem('address')
    const [address, setAddress] = useState((localAddress) ? localAddress : 'Казань, ул. Театральная д.3')
    const changeAddress = (e) => {
        setAddress(e.target.innerText)
        localStorage.setItem('address', e.target.innerText);
    }

    return (
        <>
            <footer className="d-block">
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-6 col-lg-3 order-2 order-lg-1 text-center text-sm-start'>
                            <div className='mb-3 mb-lg-4'>@{(new Date().getFullYear())} REFETTORIO</div>
                            <ul className='list-unstyled primary'>
                                <li className='mb-2'><Link to={POLICY_ROUTE}>Политика конфиденциальности</Link></li>
                                <li className='mb-2'><Link to={OFFER_ROUTE}>Договор оферты</Link></li>
                                <li><Link to={TERMS_ROUTE}>Правила оплаты</Link></li>
                            </ul>
                        </div>
                        <div className='col-12 col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0'>
                            <nav className='d-none d-lg-block w-100'>
                                <ul className='list-unstyled w-100'>
                                    <li><Link to={HOME_ROUTE}>Меню</Link></li>
                                    <li><Link to={ABOUT_ROUTE}>О нас</Link></li>
                                    <li><Link to={VACANCY_ROUTE}>Бонусы</Link></li>
                                    <li><Link to={DELIVERY_ROUTE}>Доставка и оплата</Link></li>
                                </ul>
                            </nav>
                            <ul className='list-unstyled payment mt-lg-4'>
                                <li>
                                    <img src="/images/payment/alpha.png" alt="Альфа-банк" />
                                </li>
                                <li>
                                    <img src="/images/payment/visa.png" alt="visa" />
                                </li>
                                <li>
                                    <img src="/images/payment/mastercard.png" alt="mastercard" />
                                </li>
                                <li>
                                    <img src="/images/payment/mir.png" alt="мир" />
                                </li>
                                <li>
                                    <img src="/images/payment/verified-by-visa.png" alt="verified by visa" />
                                </li>
                                <li>
                                    <img src="/images/payment/securecode.png" alt="mastercard securecode" />
                                </li>
                                <li>
                                    <img src="/images/payment/miraccept.png" alt="mir accept" />
                                </li>
                            </ul>
                        </div>
                        <div className='col-sm-6 col-lg-3 order-3 text-center text-sm-end mt-4 mt-sm-0'>
                            <div className='mb-2'><a href='tel:+78432920292'>+7 (843) 292-0-292</a></div>
                            <div className='d-flex align-items-center justify-content-center justify-content-sm-end'>
                                <span>Наши социальные сети:</span>
                                <a href="https://www.instagram.com/arome_kzn/" className="social ms-3" target="_blank">
                                    <img src="/images/qr.jpeg" width={45} />
                                </a>
                            </div>
                            <a href="http://asmpromo.ru/" alt="Создание и продвижение сайтов" title="Создание и продвижение сайтов" target="_blank" className='asm mt-3 mt-sm-4 mt-lg-5'>
                                <span>Создание и продвижение сайтов</span>
                                <img src="/images/asm_white.png" alt="asm" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-4 col-xl-3">
                            <div className="row gx-2 gx-lg-4">
                                <div className="col-6">
                                    <nav>
                                        <ul>
                                            {
                                                product.category.map(item => (<li><Link to={CATALOG_ROUTE + '/' + item.id}>{item.title}</Link></li>))
                                            }
                                        </ul>
                                    </nav>
                                </div>
                                <div className="col-6">
                                    <nav>
                                        <ul>
                                            <li><Link to={ABOUT_ROUTE}>О нас</Link></li>
                                            <li><Link to={DELIVERY_ROUTE}>Доставка и оплата</Link></li>
                                            <li><Link to={POLICY_ROUTE}>Политика конфиденциальности</Link></li>
                                            <li><Link to={TERMS_ROUTE}>Пользовательское соглашение</Link></li>
                                            <li><Link to={OFFER_ROUTE}>Публичная оферта</Link></li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 col-xl-3 text-center d-flex flex-column justify-content-between">
                            <div className="mb-3 mb-lg-0">
                                <Link to={HOME_ROUTE} className="d-inline-block mb-2 mb-lg-4"><img src="/images/footerlogo.svg" alt="Totos" className="img-fluid footer-logo" /></Link>
                                <div>© 2021</div>
                            </div>
                            <div>
                                <div className="sec-font mb-2 mb-lg-3">Мы в социальных сетях:</div>
                                <div className="d-flex justify-content-center">
                                    <a href="https://www.instagram.com/totospizza.ru/" className="social" target="_blank">
                                        <img src="/images/icons/instagram.svg" alt="" />
                                    </a>
                                    <a href="https://vk.com/totospizza" className="social" target="_blank">
                                        <img src="/images/icons/vk.svg" alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 col-xl-3 d-flex flex-column justify-content-between">
                            <div>
                                <div className="sec-font d-flex align-items-start">
                                    Ямашева 97 ТЦ “XL” (+7 843 226-80-60) Гвардейская 33 (+7 843 226-80-06)
                                </div>
                            </div>
                            <div>
                                <a href="http://asmpromo.ru/" alt="Создание и продвижение сайтов"
                                    title="Создание и продвижение сайтов" target="_blank"
                                    className="d-flex justify-content-end align-items-center">
                                    <div className="sec-font text-end">Создание и продвижение сайтов</div>
                                    <img src="/images/asm.svg" alt="" className="ms-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div> */}
            </footer>

            <footer className="mobile d-flex d-lg-none">
                <Link to={HOME_ROUTE} className="link">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path className='fill' fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"></path>
                        <path className='fill' fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"></path>
                    </svg>
                </Link>
                {
                    (user.isAuth) ?
                        <Link to={PROFILE_ROUTE} className="link">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className='fill' d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>
                        </Link>
                        :
                        <Link data-bs-toggle="modal" data-bs-target="#entrance" className="link">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className='fill' d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>
                        </Link>
                }
                <Link to={CART_ROUTE} className="position-relative link">
                    <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path className='fill' d="M35.8538 18.7497L26.7288 5.08301C26.333 4.49967 25.6663 4.20801 24.9997 4.20801C24.333 4.20801 23.6663 4.49967 23.2705 5.10384L14.1455 18.7497H4.16634C3.02051 18.7497 2.08301 19.6872 2.08301 20.833C2.08301 21.0205 2.10384 21.208 2.16634 21.3955L7.45801 40.708C7.93717 42.458 9.54134 43.7497 11.458 43.7497H38.5413C40.458 43.7497 42.0622 42.458 42.5622 40.708L47.8538 21.3955L47.9163 20.833C47.9163 19.6872 46.9788 18.7497 45.833 18.7497H35.8538ZM18.7497 18.7497L24.9997 9.58301L31.2497 18.7497H18.7497ZM24.9997 35.4163C22.708 35.4163 20.833 33.5413 20.833 31.2497C20.833 28.958 22.708 27.083 24.9997 27.083C27.2913 27.083 29.1663 28.958 29.1663 31.2497C29.1663 33.5413 27.2913 35.4163 24.9997 35.4163Z" />
                    </svg>
                    {(cart.cart.length > 0) && <div className="count position-absolute top-0 end-0 black fw-6">{cart.cart.length}</div>}
                </Link>
                <button className="link" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#right-menu">
                    <svg viewBox="0 0 33 33" xmlns="http://www.w3.org/2000/svg">
                        <path className='stroke' d="M4.125 16.5H28.875" />
                        <path className='stroke' d="M4.125 8.25H28.875" />
                        <path className='stroke' d="M4.125 24.75H28.875" />
                    </svg>
                </button>
            </footer>

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="right-menu">
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                <div className="offcanvas-body">
                    <nav>
                        <ul className='list-unstyled' data-bs-dismiss="offcanvas">
                            <li><NavLink to={ABOUT_ROUTE}>О нас</NavLink></li>
                            <li><NavLink to={SALE_ROUTE}>Акции</NavLink></li>
                            <li><NavLink to={DELIVERY_ROUTE}>Доставка и оплата</NavLink></li>
                            <li><NavLink to={VACANCY_ROUTE}>Бонусы</NavLink></li>
                            <li><NavLink to={FAVORITES_ROUTE}>Сравнение</NavLink></li>
                        </ul>
                    </nav>
                </div>
                <div className="offcanvas-footer py-3 py-sm-4 px-4 px-sm-5">
                    <div className="d-flex d-md-none align-items-center mb-3">
                        <img src="/images/icons/place.svg" alt="адрес" className='icon' />
                        <NavDropdown
                            title={address}
                            className="address-menu"
                        >
                            <NavDropdown.Item onClick={changeAddress} active={(address === 'Казань, ул. Театральная д.3') ? true : false}>Казань, ул. Театральная д.3</NavDropdown.Item>
                        </NavDropdown>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                        <img src="/images/icons/schedule.svg" alt="расписание" className='icon' />
                        <span className="ms-2">Ежедневно с 10:00 до 23:00</span>
                    </div>

                    <a href="tel:+78432920292" className='d-flex align-items-center'>
                        <img src="/images/icons/call.svg" alt="звонок" className='icon' />
                        <span className="fs-12 ms-2">+7 (843) 292-0-292</span>
                    </a>
                </div>
            </div>

            <div id="cookie" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                <p className="gray-1 lh-15 mb-4">Мы используем файлы cookie, чтобы помочь персонализировать контент, адаптировать и оценивать рекламу, а также повысить безопасность. Оставаясь на этом веб-сайте, вы соглашаетесь на использование файлов cookie в соответствии с нашей Политикой использования файлов cookie.</p>
                <div className="d-flex">
                    <button type="button" className="btn btn-1">Согласен</button>
                    <button type="button" className="btn gray-3 ms-sm-4" data-bs-dismiss="toast" aria-label="Закрыть">Закрыть окно</button>
                </div>
            </div>

            {(!user.isAuth) &&
                <>
                    <div className="modal fade" id="entrance" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <button type="button" className="btn-close" data-bs-dismiss="modal">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6L18 18" />
                                    </svg>
                                </button>
                                <div className="modal-body">
                                    <h5 className="text-center mb-4 mb-md-5">Вход</h5>
                                    <form onSubmit={formLogin}>
                                        <div className="mb-2 mb-md-3">Номер телефона</div>
                                        <InputMask mask="+7 999 999 99 99" placeholder="+7 000 000 00 00" maskChar="" className="mb-3 mb-md-4" defaultValue={phone} onChange={e => setPhone(e.target.value)} />
                                        <div className="mb-2 mb-md-3">Пароль</div>
                                        <div className="password mb-3 mb-md-4">
                                            <input type={viewPass ? 'text' : 'password'} name="password" autoComplete="current-password" minLength="4" maxLength="50" placeholder="Пароль" data-state="invisible" onChange={e => setPassword(e.target.value)} />
                                            <button type="button" data-state={viewPass ? 'visible' : 'invisible'} onClick={viewPassword} className="pass_btn" ></button>
                                        </div>
                                        <div className="d-flex flex-column flex-sm-row align-items-center my-4 my-md-5">
                                            <button type="submit" className="btn btn-1 px-5 py-sm-3 me-sm-3 me-md-4 mb-3 mb-sm-0">Войти</button>
                                            <button type="button" className="blue" data-bs-toggle="modal" data-bs-target="#new-password" data-bs-dismiss="modal">Забыли пароль?</button>
                                        </div>
                                        <div className="d-flex flex-wrap align-items-center">
                                            <span>У вас ещё нет учётной записи?</span>
                                            <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#registration" data-bs-dismiss="modal">Регистрация</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="registration" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <button type="button" className="btn-close" data-bs-dismiss="modal">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6L18 18" />
                                    </svg>
                                </button>
                                <div className="modal-body">
                                    {
                                        (isRegistarion) ?
                                            <>
                                                <h5 className="text-center">Войдите в свой профиль</h5>
                                                <div className="text-center mb-3 mb-md-5">На номер {phone} выслано СМС-сообщение с данными для входа.</div>
                                                <div className="d-flex justify-content-center">
                                                    <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Войти в профиль</button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <h5 className="text-center mb-4 mb-md-5">Регистрация</h5>
                                                <form onSubmit={formReg}>
                                                    <div className="mb-2 mb-md-3">Номер телефона</div>
                                                    <InputMask mask="+7 999 999 99 99" placeholder="+7 000 000 00 00" maskChar="" className="mb-3 mb-md-4" defaultValue={phone} onChange={e => setPhone(e.target.value)} />
                                                    <button type="submit" className="btn btn-1 py-sm-3 mb-4 mb-md-5">Зарегистрироваться</button>
                                                    <div className="d-flex flex-wrap align-items-center">
                                                        <span>У вас уже есть учётная запись?</span>
                                                        <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Вход</button>
                                                    </div>
                                                </form>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="new-password" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <button type="button" className="btn-close" data-bs-dismiss="modal">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6L18 18" />
                                    </svg>
                                </button>
                                <div className="modal-body">
                                    {
                                        (isNewPassword) ?
                                            <>
                                                <h5 className="text-center">Восстановление пароля</h5>
                                                <div className="text-center mb-3 mb-md-5">На номер {phone} выслано СМС-сообщение с новыми данными для входа.</div>
                                                <div className="d-flex justify-content-center">
                                                    <button type="button" className="blue ms-1" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Войти в профиль</button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <h5 className="text-center mb-4 mb-md-5">Восстановить пароль</h5>
                                                <form onSubmit={formNewPassword}>
                                                    <div className="mb-2 mb-md-3">Номер телефона</div>
                                                    <InputMask mask="+7 999 999 99 99" placeholder="+7 000 000 00 00" maskChar="" className="mb-3 mb-md-4" defaultValue={phone} onChange={e => setPhone(e.target.value)} />
                                                    <div className="d-flex flex-column flex-sm-row align-items-center my-2 my-md-2">
                                                        <button type="submit" className="btn btn-1 px-4 py-sm-3 me-sm-3 me-md-3 mb-3 mb-sm-0">Восстановить</button>
                                                        <button type="button" className="blue" data-bs-toggle="modal" data-bs-target="#entrance" data-bs-dismiss="modal">Вспомнили пароль?</button>
                                                    </div>
                                                </form>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
})

export default Footer

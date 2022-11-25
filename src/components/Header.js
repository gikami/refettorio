import React, { useContext, useState, useEffect } from 'react'
import { Context } from "../index"
import { NavLink, Link, useLocation } from "react-router-dom"
import { NavDropdown } from "react-bootstrap"
import { PROFILE_ROUTE, HOME_ROUTE, ABOUT_ROUTE, SALE_ROUTE, DELIVERY_ROUTE, FAVORITES_ROUTE, CART_ROUTE, CHECKOUT_ROUTE, VACANCY_ROUTE, CATALOG_ROUTE } from "../utils/consts"
import { observer } from "mobx-react-lite"
import CartContent from "./Cart"
import { fetchCategory } from "../http/productAPI"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
SwiperCore.use([Navigation]);

const Header = observer(() => {
    const location = useLocation()
    const { user, cart, product } = useContext(Context)
    const [isShown, setIsShown] = useState(false)
    const localAddress = localStorage.getItem('address')
    const [address, setAddress] = useState((localAddress) ? localAddress : 'Казань, ул. Театральная д.3')

    useEffect(() => {
        fetchCategory().then(data => {
            product.setCategory(data.category[0].subcategory)
        })
    }, [])

    const changeAddress = (e) => {
        setAddress(e.target.innerText)
        localStorage.setItem('address', e.target.innerText);
    }

    return (
        <>
            <header>
                <div className="container">
                    <NavLink exact to={HOME_ROUTE} className="logo"><img src='/images/logo.png' alt="Refettorio" /></NavLink>
                    <div className='flex-1'>
                        <div className='d-flex justify-content-between align-items-center fs-11'>
                            {/* <form className='form-search d-flex align-items-center'>
                                <input type="search" placeholder='Поиск по сайту...' />
                                <button type='submit' className='btn btn-2'>Найти</button>
                            </form> */}

                            <div className="d-none d-md-flex align-items-center">
                                <img src="/images/icons/place.svg" alt="адрес" className='icon' />
                                <NavDropdown
                                    title={address}
                                    className="address-menu"
                                >
                                    <NavDropdown.Item onClick={changeAddress} active={(address === 'Казань, ул. Театральная д.3') ? true : false}>Казань, ул. Театральная д.3</NavDropdown.Item>
                                </NavDropdown>
                            </div>

                            <div className="d-none d-xl-flex align-items-center">
                                <img src="/images/icons/schedule.svg" alt="расписание" className='icon' />
                                <span className="ms-2">пн-вс с 10:00 до 23:00 </span>
                            </div>

                            <a href="tel:+78432920292" className='d-none d-lg-flex align-items-center'>
                                <img src="/images/icons/call.svg" alt="звонок" className='icon' />
                                <span className="ms-2">+7 (843) 292-0-292</span>
                            </a>

                            <a href="https://www.instagram.com/arome_kzn/" target="_blank">
                                <img src="/images/qr.jpeg" width={45} />
                            </a>
                        </div>

                        <div className="mt-3 w-100 flex-1 d-none d-lg-flex align-items-center">
                            <nav className="w-100">
                                <ul>
                                    {/* <li>
                                        <NavLink to="/">
                                            <img src='/images/icons/menu.png' alt="Меню" className='icon me-2'/>
                                            <span>Меню</span>
                                        </NavLink>
                                    </li> */}
                                    <li><NavLink to={ABOUT_ROUTE}>О нас</NavLink></li>
                                    <li><NavLink to={SALE_ROUTE}>Акции</NavLink></li>
                                    <li><NavLink to={DELIVERY_ROUTE}>Доставка и оплата</NavLink></li>
                                    <li><NavLink to={VACANCY_ROUTE}>Вакансии</NavLink></li>
                                    <li>
                                        <NavLink to={FAVORITES_ROUTE}>
                                            <img src='/images/icons/compare.png' alt="Сравнение" className='icon me-2' />
                                            <span>Сравнение</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        {
                                            (user.isAuth) ?
                                                <NavLink to={PROFILE_ROUTE} type="button" className="d-none d-md-flex btn-svg">
                                                    <span>Личный кабинет</span>
                                                    <img src='/images/icons/personal.png' alt="Личный кабинет" className='icon ms-2' />
                                                </NavLink>
                                                :
                                                <button type="button" data-bs-toggle="modal" data-bs-target="#entrance" className="d-none d-md-flex">
                                                    <span>Личный кабинет</span>
                                                    <img src='/images/icons/personal.png' alt="Личный кабинет" className='icon ms-2' />
                                                </button>
                                        }
                                    </li>
                                    <li>
                                        <div id="toggle-cart">
                                            <NavLink to={CART_ROUTE} onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} className="position-relative">
                                                <img src='/images/icons/cart.png' alt="Корзина" className='icon me-2' />
                                                <span>Корзина</span>
                                                {(cart.cart.length > 0) && <span>({cart.cart.length})</span>}
                                            </NavLink>
                                            {isShown ?
                                                <div className="cart-preview" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
                                                    <div className="cart-scroll">
                                                        <CartContent type={'mini'} />
                                                    </div>
                                                    {
                                                        (cart.cart && cart.cart.length > 0) &&
                                                        <>
                                                            <div className="px-4 pt-3 pb-1">
                                                                <NavLink to={CART_ROUTE} className="btn btn-2 w-100">В корзину</NavLink>
                                                            </div>
                                                            <div className="px-4 pt-2 pb-2">
                                                                <NavLink to={CHECKOUT_ROUTE} className="btn btn-1 w-100">Оформить заказ {cart.total} ₽</NavLink>
                                                            </div>
                                                        </>
                                                    }

                                                </div>
                                                : null
                                            }
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header >
            <div className="sec-2" id="soop-menu">
                <div className="container position-relative">
                    <Swiper
                        className="soops"
                        slidesPerView={3}
                        modules={[Navigation]}
                        navigation
                        breakpoints={{
                            576: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 5,
                            },
                            992: {
                                slidesPerView: 7,
                            },
                            1200: {
                                slidesPerView: 8,
                            }
                        }}
                    >
                        {product.category.map((category, i) =>
                            <SwiperSlide>
                                {
                                    (location.pathname && location.pathname == '/') ?
                                        <Link to={CATALOG_ROUTE + '/' + category.id} spy={true} smooth={true} duration={300} className={(category.id === product.selectedCategory.id) ? 'btn soop active' : 'btn soop'}>{category.title}</Link>
                                        :
                                        <NavLink to={CATALOG_ROUTE + '/' + category.id} className={(category.id === product.selectedCategory.id) ? 'btn soop active' : 'btn soop'}>{category.title}</NavLink>
                                }
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </div>

        </>
    );
})

export default Header;
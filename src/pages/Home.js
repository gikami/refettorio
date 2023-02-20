import React, { useContext, useEffect, useState } from 'react'
import MetaTags from 'react-meta-tags'
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { useParams, Link } from "react-router-dom"
import { fetchProducts } from "../http/productAPI"
import { fetchSale } from "../http/saleAPI"
import { CATALOG_ROUTE } from "../utils/consts"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper'

SwiperCore.use([Navigation, Pagination])

const Home = observer(() => {
    const { product } = useContext(Context)
    const { catalogId } = useParams()
    const [sale, setSale] = useState(false)

    useEffect(() => {
        fetchSale().then(data => {
            setSale(data)
        });

        if (catalogId) {
            let selectCategory = product.category.find(el => el.id == catalogId)
            if (selectCategory) {
                product.setSelectedCategory(selectCategory)
            }
        } else {
            fetchProducts().then(data => {
                product.setProducts(data[0].subProducts)
            })
        }
    }, [product.page, product.selectedCategory, product.category])

    return (
        <>
            <MetaTags>
                <meta property="og:title" content="«RefettoriO» — ваше маленькое путешествие в Италию." />
                <meta property="og:description" content="«RefettoriO» — это ваше маленькое и незабываемое путешествие в Италию. Место, где вы всегда сможете отвлечься от городской суеты, при этом находясь в историческом центре Казани. Наших посетителей приятно порадуют дружелюбная атмосфера, заботливое отношение персонала к каждому гостю, демократичные цены и широкий выбор блюд." />
                <meta property="og:site_name" content="Refettorio" />
                <meta property="og:image" content={process.env.REACT_APP_URL + 'favicon.png'} />
            </MetaTags>
            <main>
                <section className='sec-1'>
                    <Swiper
                        loop={true}
                        slidesPerView={1}
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        className="swiper-main"
                    >
                        <SwiperSlide className='position-relative'>
                            <img src="/images/main-slider/slide1.jpg" alt="" className='slide-bg' />
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h1>Пиццерия «RefettoriO»!</h1>
                                        <p className='fs-18 mb-3'>Маленькая Италия в центре Казани.</p>
                                        {/* <p className='fs-16 mb-3'>Дорогие гости!</p>
                                        <p className='fs-15 mb-3'>Скидка в заведении по будням с 12 до 15 - 20%.</p>
                                        <p className='fs-15 mb-3'>Скидка на день рождения -15%;</p> */}
                                        {/* <ul className='list-unstyled fs-13 ps-3 mb-3'>
                                            <li>Скидка на день рождения -15%;</li>
                                        </ul> */}
                                        {/* <p className='fs-15'>С уважением Ваша REFETTORIO!</p> */}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className='position-relative'>
                            <img src="/images/main-slider/slide3.jpg" alt="" className='slide-bg' />
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h2 style={{ fontSize: '3.5em' }}>Скачай приложение и получи 300 приветственных баллов</h2>
                                        <p>
                                            <a href="https://play.google.com/store/apps/details?id=cafe.refettorio.app" target="_blank" className='me-3 mt-2'><img width="200" src="/images/main-slider/android.png" alt="Google Play Reffetorio" /></a>
                                            <a href="https://apps.apple.com/ru/app/refettorio-%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7-%D0%BF%D0%B8%D1%86%D1%86%D1%8B/id1636478969" target="_blank" className='me-3 mt-2'><img width="200" src="/images/main-slider/ios.png" alt="App Store Reffetorio" /></a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* <SwiperSlide className='position-relative'>
                            <img src="/images/main-slider/slide2.jpg" alt="" className='slide-bg' />
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h2>Вы можете скачать наше мобильное приложение</h2>
                                        <p className='fs-15 mb-2'>Наше приложение на доставку уже появилось в GOOGLE PLAY и APP STORE*</p>
                                        <div className='d-flex justify-content-center justify-content-md-start text-center mt-4'>
                                            <figure className='position-relative'>
                                                <img src="/images/qr-1.jpeg" alt="Android" />
                                                <figcaption className='mt-2'><a className='stretched-link' onClick={() => setAnd(true)}>Android</a></figcaption>
                                            </figure>
                                            <figure className='position-relative ms-4'>
                                                <img src="/images/qr-2.jpeg" alt="IOS" />
                                                <figcaption className='mt-2'><a className='stretched-link' onClick={() => setIOS(true)}>IOS</a></figcaption>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide> */}
                    </Swiper>
                </section>

                <section className="sec-2 mb-8 mt-4 mt-md-5">
                    <div className="container">
                        <h2>Мы предлагаем ознакомиться с нашим меню</h2>

                        {
                            (product.category && product.category.length > 0) && <div className="category-row row">
                                {
                                    product.category.map(item => <div className="col-md-3 col-6">
                                        <Link to={CATALOG_ROUTE + '/' + item.id} className="category-card text-center">
                                            <img src={(item.image) ? process.env.REACT_APP_API_URL + 'category/' + item.image : '/images/no-image.jpg'} className="category-card-image" />
                                            <p className="category-card-title">{item.title}</p>
                                        </Link>
                                    </div>)
                                }
                            </div>
                        }


                        {/* <p style={{textAlign: 'center',margin: 30,fontSize: 18, color: 'red'}}>На сайте ведутся технические работы, заказы принимаем по телефонам: Ямашева 97: +7 843 226-80-60, Гвардейская 33: +7 843 226-80-06</p> */}
                        {/* <div className="card my-4">
                            <div className="card-body text-danger">В данный момент мы не принимаем заказы с сайта. Вы можете сделать заказ по номерам 226-80-06 (Гвардейская 33) или 226-80-60 (Ямашева 97)</div>
                        </div> */}

                    </div>
                </section>
                {
                    sale &&
                    <section id="sec-12" className='mb-5'>
                        <div className='container'>
                            <h2>Спецпредложения и акции</h2>
                            <Swiper
                                className='classic-arrows pb-5'
                                loop={true}
                                slidesPerView={1}
                                spaceBetween={10}
                                modules={[Navigation, Pagination]}
                                pagination={{
                                    clickable: true,
                                    type: 'fraction'
                                }}
                                navigation
                                breakpoints={{
                                    576: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                    },
                                    992: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },
                                    1200: {
                                        slidesPerView: 3,
                                        spaceBetween: 30,
                                    }
                                }}
                            >
                                {
                                    sale.map((sale, i) =>
                                        <SwiperSlide>
                                            <div className='promotion'>
                                                <img src={(sale.image) ? process.env.REACT_APP_API_URL + '/sale/' + sale.image : '/images/no-image.jpg'} alt={sale.title} />
                                                <div className='promo-info'>
                                                    <div className='title'><div>{sale.title}</div></div>
                                                    <div>{sale.desc}</div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                }
                            </Swiper>
                        </div>
                    </section>
                }

                <section id="sec-4">
                    <div className='container'>
                        <h2>Пиццерия «Refettorio» рекомендуют наши гости</h2>
                        <Swiper
                            className='classic-arrows'
                            loop={true}
                            slidesPerView={1}
                            spaceBetween={10}
                            modules={[Navigation, Pagination]}
                            pagination={{
                                clickable: true,
                                type: 'fraction'
                            }}
                            navigation
                            breakpoints={{
                                576: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                992: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                }
                            }}
                        >
                            <SwiperSlide>
                                <div className='review'>
                                    <div className='d-flex align-items-center mb-3 mb-sm-4'>
                                        <img src="/images/icons/user2.svg" alt="клиент" />
                                        <div className='ms-3 fs-13 text-truncate'>Darina Sokolovskaya</div>
                                    </div>
                                    <p className='fs-12'>Хорошее заведение! Все понравилось, еда и приятная атмосфера. Очень вкусная пицца на очень тонком тесте. Вежливый и отзывчивый персонал!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='review'>
                                    <div className='d-flex align-items-center mb-3 mb-sm-4'>
                                        <img src="/images/icons/user2.svg" alt="клиент" />
                                        <div className='ms-3 fs-13 text-truncate'>Альберт</div>
                                    </div>
                                    <p className='fs-12'>Добрый день! Наконец-то появилась возможность разместить заказ на сайте. Молодцы! Ждем мобильное приложение!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='review'>
                                    <div className='d-flex align-items-center mb-3 mb-sm-4'>
                                        <img src="/images/icons/user2.svg" alt="клиент" />
                                        <div className='flex-1 ms-3 fs-13 text-truncate'>Татьяна</div>
                                    </div>
                                    <p className='fs-12'>Очень любим с семьей ходить в RefettoriO! Приятная атмосфера, вкусная еда, доброжелательный персонал. Пицца просто огонь!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='review'>
                                    <div className='d-flex align-items-center mb-3 mb-sm-4'>
                                        <img src="/images/icons/user2.svg" alt="клиент" />
                                        <div className='flex-1 ms-3 fs-13 text-truncate'>Лилия</div>
                                    </div>
                                    <p className='fs-12'>После карантина стали даже лучше! Отличная подача, вкусно, порции достаточные, есть гибкая система скидок и акций. Отлично настроили сайт!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='review'>
                                    <div className='d-flex align-items-center mb-3 mb-sm-4'>
                                        <img src="/images/icons/user2.svg" alt="клиент" />
                                        <div className='flex-1 ms-3 fs-13 text-truncate'>Юлия</div>
                                    </div>
                                    <p className='fs-12'>Очень вкусная пицца!)</p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </section>

                <section id="sec-5" className='mb-md-5'>
                    <div className='container py-5'>
                        <div class="row">
                            <div class="col-lg-4 mb-4 mb-lg-0">
                                <h2>Контакты</h2>
                                <div className='fs-12'>
                                    <div className='fw-6 mb-2'>Телефон:</div>
                                    <div className='mb-2'><a href="tel:+78432920292">+7 (843) 292-0-292</a></div>
                                    <div><a href="tel: +79872152215"> +7 (987) 215-22-15</a></div>

                                    <div className='fw-6 mt-4 mb-2'>Время работы:</div>
                                    <div className='mb-2'>Пиццерия открыта: пн-вс с 10:00 до 23:00</div>
                                    <div>Заказы на доставку принимаются ежедневно с&nbsp;10:00 до&nbsp;22:30</div>

                                    <div className='fw-6 mt-4 mb-2'>Адрес:</div>
                                    <div>г.Казань, ул. Театральная д.3</div>

                                    <div className='fw-6 mt-4 mb-2'>Вопросы и&nbsp;предложения:</div>
                                    <div><a href="mailto:Refetorio@yandex.ru">Refetorio@yandex.ru</a></div>
                                </div>
                            </div>
                            <div class="col-lg-8 map">
                                <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A3fc00c6449a118eb4c90e7d11a3b4a6759d15f3188120b09ab509d7ad83df91b&amp;source=constructor" width="100%" height="100%" frameborder="0"></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
});

export default Home;
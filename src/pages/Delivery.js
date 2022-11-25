import React, { useEffect } from 'react'

const About = () => {
    useEffect(() => {
        document.title = "Доставка и оплата"
    }, [])
    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-8" className="mb-8">
                <div className="container">
                    <h1 className="inner">Доставка и оплата</h1>
                    <p className='fs-12 mb-4'>Бесплатная доставка при заказе от 1200 ₽ в черте города.</p>
                    <p className='fs-12 mb-4'>Среднее время доставки 1ч - 1ч 20м.</p>
                    <p className='fs-12 mb-4'>Время доставки может меняться в зависимости от количество заказов.</p>
                    <p className='fs-12 mb-4'>Скидки и акции на доставку не распространяются.</p>
                    <p className='fs-12 mb-4'>Важно понимать, что наш курьер терпеливо подождёт вас 10 минут у входа, если вдруг перестанете выходить на связь или не откроете дверь. Но затем ему придётся уезжать к другим Клиентам, чтобы вовремя доставить свежую еду. В этом случае вам будет необходимо повторно связаться с Администратором.</p>
                    <h2 className="text-center text-md-start mt-5">Способы доставки:</h2>
                    <div className="row mb-5">
                        <div className="col-lg-6 d-flex align-items-start mb-4 mb-lg-0">
                            <img src="/images/icons/delivery1.svg" alt="Доставка курьером" className='icon' />
                            <div className='flex-1 ms-2 ms-xl-4'>
                                <h6 className="fs-13 fw-6">Доставка курьером</h6>
                                <p className='fs-12'>Бесплатная доставка. Минимальная сумма заказа 1200 руб.</p>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex align-items-start">
                            <img src="/images/icons/delivery2.svg" alt="Самовывоз" className='icon' />
                            <div className='flex-1 ms-2 ms-xl-4'>
                                <h6 className="fs-13 fw-6">Самовывоз</h6>
                                <div className="fs-12 mb-2">Казань, ул. Театральная д.3</div>
                                <div className='fs-12'><a href="tel:+7 (843) 292-0-292">+7 (843) 292-0-292</a></div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-center text-md-start">Способы оплаты:</h2>
                    <div className="row">
                        <div className="col-lg-4 d-flex align-items-start mb-4 mb-lg-0">
                            <img src="/images/icons/payment1.svg" alt="Онлайн оплата" className='icon' />
                            <div className='flex-1 ms-2 ms-xl-4'>
                                <h6 className="fs-13 fw-6">Онлайн оплата</h6>
                                <ul className='list-unstyled payment mt-2'>
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
                        </div>

                        <div className="col-lg-4 d-flex align-items-start mb-4 mb-lg-0">
                            <img src="/images/icons/payment1.svg" alt="Оплата картой курьеру" className='icon' />
                            <div className='flex-1 ms-2 ms-xl-4'>
                                <h6 className="fs-13 fw-6">Оплата картой курьеру</h6>
                                <p>Курьер привезёт с&nbsp;собой мобильный платёжный терминал. Принимаются карты Mastercard, Maestro и&nbsp;Visa.</p>
                            </div>

                        </div>
                        <div className="col-lg-4 d-flex align-items-start">
                            <img src="/images/icons/payment1.svg" alt="Оплата наличными" className='icon' />
                            <div className='flex-1 ms-2 ms-xl-4'>
                                <h6 className="fs-13 fw-6">Оплата наличными</h6>
                                <p>Вы&nbsp;можете оплатить заказ наличными нашему курьеру или&nbsp;при&nbsp;самовывозе</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;

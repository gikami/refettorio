import React, { useEffect } from 'react'

const About = () => {

    useEffect(() => {
        document.title = "Контакты"
    }, [])

    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-8" className="mb-8">
                <div className="container">
                    <h1 className="h2 fw-7 mb-4 text-center text-md-start">Контакты</h1>
                    <div className="row mb-5">
                        <div className="col-md-6">
                            <div className="d-flex align-items-end mb-4">
                                <img className="me-4 mb-1" src="/images/icons/marker.svg" width="22" />
                                <div className="fs-12 fw-5">
                                    <h5 className="fs-12">Советский район</h5>
                                    ул. Гвардейская, 33<br />
                                    (вход напротив гостиницы "Гвардейская")
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <img className="me-4" src="/images/icons/phone.svg" width="22" />
                                <div className="fs-12 fw-5">
                                    8(843)226-80-06
                                </div>
                            </div>
                            <div className="d-flex align-items-start mb-5">
                                <img className="me-4" src="/images/icons/clock.svg" width="22" />
                                <div className="fs-12 fw-5">
                                    <b>Доставка:</b> понедельник - суббота с 10:00 до 21:45,
                                    воскресенье c 10:00 до 21:45
                                    <br /><br />
                                    <b>Ресторан:</b> понедельник - суббота с 10:00 до 22:00,
                                    воскресенье c 10:00 до 22:00
                                </div>
                            </div>
                            <div className="d-flex align-items-end mb-4">
                                <img className="me-4 mb-1" src="/images/icons/marker.svg" width="22" />
                                <div className="fs-12 fw-5">
                                    <h5 className="fs-12">Ново-Савинский район</h5>
                                    ул. Ямашева, 97 (ТЦ XL)
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <img className="me-4" src="/images/icons/phone.svg" width="22" />
                                <div className="fs-12 fw-5">
                                    8(843)226-80-60
                                </div>
                            </div>
                            <div className="d-flex align-items-start mb-4">
                                <img className="me-4" src="/images/icons/clock.svg" width="22" />
                                <div className="fs-12 fw-5">
                                    <b>Доставка:</b> понедельник - суббота с 10:00 до 21:45,
                                    воскресенье c 10:00 до 22:00
                                    <br /><br />
                                    <p><b>Ресторан:</b> понедельник - суббота с 10:00 до 22:00,
                                        воскресенье c 10:00 до 22:00</p>
                                    <p><span className="fw-7">Вопросы, отзывы и предложения:</span> <span className="fw-3">Refetorio@yandex.ru</span></p>
                                    {/* <p><span className="fw-7">Мы в соц.сетях:</span></p> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div id="map">
                                <iframe src="https://www.google.com/maps/d/embed?mid=1yPO2Pv6vngPphS2hiNjN94Jt0epVx-nA&ehbc=2E312F" width="100%" height="550"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;

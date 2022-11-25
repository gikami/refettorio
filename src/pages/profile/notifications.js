import React from 'react';
import { Link, useParams } from "react-router-dom";
import { PROFILE_ROUTE, HOME_ROUTE } from "../../utils/consts";
import SideBar from "./components/menu";

const Notifications = () => {
    const { id } = useParams()
    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-13" className="mb-8">
                <div className="container">
                    <div className="row">
                        <SideBar />
                        <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                            <h5>Уведомления</h5>
                            <div className="w-fit mb-5">
                                <img src="/images/icons/notification.svg" alt="уведомления" className="mx-auto mb-3 d-block img-fluid" />
                                <div className="gray-3 text-center">Здесь ещё не было <br /> уведомлений</div>
                            </div>

                            <div className="row mb-5">
                                <div className="col-lg-8">
                                    <div className="primary mb-3">Новое</div>
                                    <div className="notification type-2 mb-4">
                                        <img src="/images/img-16.jpg" />
                                        <div>
                                            <div className="d-flex justify-content-between align-items-sm-center mb-1">
                                                <div>С днём рождения!</div>
                                                <div className="date ms-2">24.06.21</div>
                                            </div>
                                            <div className="gray-2 mb-2">Дарим персональную скидку и 2 пиццы перерони в подарок!</div>
                                            <div className="fs-08"><a href="" className="primary">Подробнее</a></div>
                                        </div>
                                    </div>
                                    <div className="mb-3">Ранее</div>
                                    <div className="notification type-1 mb-4">
                                        <div className="d-flex justify-content-between align-items-sm-center mb-1">
                                            <div>С днём рождения!</div>
                                            <div className="date ms-2">24.06.21</div>
                                        </div>
                                        <div className="gray-2 mb-2">Дарим персональную скидку и 2 пиццы перерони в подарок!</div>
                                        <div className="fs-08"><a href="" className="primary">Подробнее</a></div>
                                    </div>
                                    <div className="notification type-3 mb-4">
                                        <div className="img mb-2">
                                            <img src="/images/img-16.jpg" />
                                            <div className="date">24.06.21</div>
                                        </div>
                                        <div className="mb-1">С днём рождения!</div>
                                        <div className="fs-08"><a href="" className="primary">Подробнее</a></div>
                                    </div>
                                    <div className="notification type-2 mb-4">
                                        <img src="/images/img-16.jpg" />
                                        <div>
                                            <div className="d-flex justify-content-between align-items-sm-center mb-1">
                                                <div>С днём рождения!</div>
                                                <div className="date ms-2">24.06.21</div>
                                            </div>
                                            <div className="gray-2 mb-2">Дарим персональную скидку и 2 пиццы перерони в подарок!</div>
                                            <div className="fs-08"><a href="" className="primary">Подробнее</a></div>
                                        </div>
                                    </div>
                                    <div className="notification type-1 mb-4">
                                        <div className="d-flex justify-content-between align-items-sm-center mb-1">
                                            <div>С днём рождения!</div>
                                            <div className="date ms-2">24.06.21</div>
                                        </div>
                                        <div className="gray-2 mb-2">Дарим персональную скидку и 2 пиццы перерони в подарок!</div>
                                        <div className="fs-08"><a href="" className="primary">Подробнее</a></div>
                                    </div>
                                </div>
                            </div>
                            <Link to={PROFILE_ROUTE} className="gray-3 d-flex align-items-center">
                                <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                Вернуться назад
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
};

export default Notifications;

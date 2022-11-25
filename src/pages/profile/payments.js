import React from 'react';
import { Link, useParams } from "react-router-dom";
import { PROFILE_ROUTE, HOME_ROUTE } from "../../utils/consts";
import SideBar from "./components/menu";

const Payments = () => {
    const { id } = useParams()
    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-13" className="mb-8">
                <div className="container">
                    <div className="row">
                        <SideBar />
                        <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                            <div className="mb-5">
                                <h5 className="mb-3">Способы оплаты</h5>
                                <div className="gray-1 fs-09 mb-3">Добавьте карту для быстрой и безопасной оплаты заказов</div>
                                <button type="button" className="d-flex align-items-center">
                                    <img src="/images/icons/plus3.svg" alt="Добавить" className="me-2" />
                                    <span className="primary fs-11 fw-5">Добавить адрес</span>
                                </button>
                            </div>
                            <h5 className="">Способы оплаты</h5>
                            <div className="fw-5 mb-3">Данные карты</div>
                            <form action="" className="mb-5">
                                <div className="row gx-2 gx-sm-4">
                                    <div className="col-12 mb-3">
                                        <input type="text" placeholder="Номер карты" />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <input type="text" placeholder="мм/гг" />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <input type="text" placeholder="CVC" />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-1">Сохранить карту</button>
                                    </div>
                                </div>
                            </form>
                            <div className="mb-5">
                                <div className="d-flex justify-content-between mb-4">
                                    <h5 className="mb-0">Способы оплаты</h5>
                                </div>
                                <div className="gray-3 fs-09 mb-4">Добавьте карту для быстрой и безопасной оплаты заказов</div>
                                <div className="fs-09 mb-4">
                                    <div>Visa</div>
                                    <div className="gray-3 mt-1">**** **** **** 7685</div>
                                    <div className="d-flex mt-1">
                                        <button type="button" className="fs-09 gray-1 me-3">Редактировать</button>
                                        <button type="button" className="fs-09 gray-4">Удалить</button>
                                    </div>
                                </div>
                                <div className="fs-09 mb-4">
                                    <div>Mastercard</div>
                                    <div className="gray-3 mt-1">**** **** **** 1234</div>
                                    <div className="d-flex mt-1">
                                        <button type="button" className="fs-09 gray-1 me-3">Редактировать</button>
                                        <button type="button" className="fs-09 gray-4">Удалить</button>
                                    </div>
                                </div>
                                <button type="button" className="d-flex align-items-center">
                                    <img src="/images/icons/plus3.svg" alt="Добавить" className="me-2" />
                                    <span className="primary fs-11 fw-5">Добавить адрес</span>
                                </button>
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

export default Payments;

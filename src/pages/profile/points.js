import React, { useContext, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { PROFILE_ROUTE, HOME_ROUTE } from "../../utils/consts";
import { Context } from "../../index";
import SideBar from "./components/menu";
import QRCode from "react-qr-code";
import { updatePoint } from "../../http/userAPI"

const Points = () => {
    const { id } = useParams()
    const { user } = useContext(Context)

    useEffect(() => {
        updatePoint(user.user.id).then(data => {
            if (data) {
                console.log(data)
            }
        })
    }, []);

    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-13" className="mb-8">
                <div className="container">
                    <div className="row">
                        <SideBar />
                        <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                            <div className="mb-5">
                                <h5>Мои бонусы</h5>
                                <div className="card card-body mb-4">
                                    <div className="row row-cols-2 gx-2 h-100">
                                        <div className="d-flex flex-column justify-content-between">
                                            <h5>У вас на счету:</h5>
                                            <div className="primary fw-5 fs-12">{user.user.point} баллов</div>
                                        </div>
                                        {/* <div className="d-flex flex-column justify-content-center align-items-end">
                                            <div className="qrcode" data-bs-toggle="modal" data-bs-target="#qrcode">
                                                <QRCode size={100} value="455689003765" />
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                {/* <div className="d-flex align-items-center fw-5">
                                    Начисленные баллы
                                    <span className="primary mx-3">{user.user.point}</span>
                                    <img src="/images/icons/help-circle.svg" alt="" />
                                </div>
                                <div className="gray-1 fw-5 mt-4">Номер скидочной карты</div>
                                <div className="gray-1 mt-2">№ 4556 8900 3765</div>
                                <div className="gray-1 fw-5 mt-4">Оплачивайте заказы баллами!</div>
                                <div className="gray-1 mt-2">10 баллов = 1 рубль</div>
                                <div className="gray-1 fw-5 mt-4">Уровень начислений</div>
                                <div className="gray-1 mt-2">Сейчас вы получаете 6% от каждого заказа. Совершите покупки от <span className="primary">10 000 ₽</span> и получайте 8%.</div>
                                <div className="d-flex align-items-center fw-5 mt-4">
                                    Сумма заказов:
                                    <span className="primary mx-3">7 000 ₽</span>
                                    <img src="/images/icons/help-circle.svg" alt="" />
                                </div> */}
                            </div>

                            {/* <div className="fw-5 fs-12 gray-1 mb-4">История баллов</div>
                            <div className="table-responsive">
                                <table className="table table-borderless table-lg">
                                    <thead>
                                        <tr>
                                            <th>Операция</th>
                                            <th>Дата</th>
                                            <th>Количество</th>
                                            <th>Комментарий</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Начислено</td>
                                            <td>12.09.2021</td>
                                            <td>300</td>
                                            <td>За регистрацию</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> */}
                            <Link to={PROFILE_ROUTE} className="gray-3 d-flex align-items-center">
                                <img src="/images/icons/chevron-left.svg" alt="Вернуться назад" className="me-1" />
                                Вернуться назад
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <div className="modal fade" id="qrcode" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <div className="qrcode mx-auto mb-4">
                                <QRCode value="455689003765" />
                            </div>
                            <div className="fs-15 text-center mt-3">Карта № 4556 8900 3765</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="barcode" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <div className="barcode mx-auto mb-4">
                                A1234567890B
                            </div>
                            <div className="fs-15 text-center mt-3">Карта № 4556 8900 3765</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default Points;

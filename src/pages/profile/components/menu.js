import React from 'react';
import { Link, useParams } from "react-router-dom";
import { PROFILE_ROUTE, HOME_ROUTE } from "../../../utils/consts";
const Menu = () => {
    const { id } = useParams()

    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = HOME_ROUTE;
    }
    return (
        <div className="col-md-4 col-xl-3 mb-4">
            <nav>
                <ul>
                    <li>
                        <Link to={PROFILE_ROUTE + "/"} className={(!id) ? 'active' : null}>Мой профиль</Link>
                    </li>
                    <li>
                        <Link to={PROFILE_ROUTE + "/edit"} className={(id === 'edit') ? 'active' : null}>Настройки профиля</Link>
                    </li>
                    {/* <li>
                        <Link to={PROFILE_ROUTE + "/points"} className={(id === 'points') ? 'active' : null}>Бонусы</Link>
                    </li> */}
                    <li>
                        <Link to={PROFILE_ROUTE + "/address"} className={(id === 'address') ? 'active' : null}>Адрес доставки</Link>
                    </li>
                    {/* <li>
                        <Link to={PROFILE_ROUTE + "/payments"} className={(id === 'payments') ? 'active' : null}>Способы оплаты</Link>
                    </li> */}
                    <li>
                        <Link to={PROFILE_ROUTE + "/orders"} className={(id === 'orders') ? 'active' : null}>История заказов</Link>
                    </li>
                    {/* <li>
                        <Link to={PROFILE_ROUTE + "/terms"} className={(id === 'terms') ? 'active' : null}>Условия использования</Link>
                    </li> */}
                    {/* <li>
                        <Link to={PROFILE_ROUTE + "/notifications"} className={(id === 'notifications') ? 'active' : null}>Уведомления</Link>
                    </li> */}
                    <li>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#account-exit">Выйти</button>
                    </li>
                </ul>
            </nav>
            <div className="modal fade" id="account-exit" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" />
                                <path d="M6 6L18 18" />
                            </svg>
                        </button>
                        <div className="modal-body">
                            <div className="row justify-content-center">
                                <div className="col-md-8">
                                    <h5 className="text-center">Вы точно хотите выйти?</h5>
                                    <div className="text-center gray-3 mb-4">Не забудьте сохранить данные для входа</div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <button type="button" onClick={() => logOut()} className="btn btn-2 px-5">Да</button>
                                        <button type="button" data-bs-dismiss="modal" className="gray-2 ms-4">Остаться</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Menu;
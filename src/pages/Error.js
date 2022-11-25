import React, { useEffect } from 'react'
import { HOME_ROUTE } from "../utils/consts"
import { Link } from "react-router-dom"

const Error = () => {
    useEffect(() => {
        document.title = "Ошибка при оплате заказа"
    }, [])
    return (
        <main className='pt-4 pt-lg-5'>
            <section className="mt-5 mb-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 col-lg-6 col-xl-5">
                            <h2 className="text-center">Ошибка при оплате заказа</h2>
                            <div className="text-center mb-4 mb-sm-5">Вы можете сделать заказ по телефону 226-80-06 (Гвардейская 33) или 226-80-60 (Ямашева 97)</div>
                            <Link to={HOME_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Error;

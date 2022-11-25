import React, { useEffect, useState  } from 'react'

const Vacancy = () => {
    const [roll, setRoll] = useState(false)

    useEffect(() => {
        document.title = "Наши вакансии"
    }, [])
    return (
        <main className='pt-4 pt-lg-5'>
            <section id="sec-9" className="container mb-5">
                <h1 className='inner'>Наши вакансии</h1>
                {/* <ul className="simple-list list-unstyled">
                        <li className="vacancy">
                            <div className={(roll) ? "roll-box full" : "roll-box"} >
                                <div className="d-md-flex justify-content-between align-items-center mb-4 mb-md-5">
                                    <div>
                                        <div className="fs-14 mb-4">Шеф повар</div>
                                        <div className="mb-2">Требуемый опыт: более 6 лет</div>
                                        <div>Занятость: полный день</div>
                                    </div>
                                    <div className="text-md-end mt-3 mt-md-0">
                                        <div className="fs-12 mb-3 mb-md-4">По итогам собеседования</div>
                                        <button type="button"  data-bs-toggle="modal" data-bs-target="#respond" className="btn btn-1 ms-md-auto">Откликнуться</button>
                                    </div>
                                </div>
                                <div className="fw-6 mb-3">Обязанности:</div>
                                <ul className="default list-unstyled">
                                    <li className="mb-2">Приготовление салатов, холодных закусок, сендвичей, гамбургеров, напитков;</li>
                                    <li className="mb-2">Нарезка фруктовых десертов. Приготовление готовой кулинарии, основных блюд и гарниров;</li>
                                    <li className="mb-2">Разделка мяса, кур и рыбы;</li>
                                    <li className="mb-2">Приёмка и контроль качества сырья, контроль сроков годности.</li>
                                </ul>
                                <div className="fw-6 mb-3 mt-4">Требования:</div>
                                <ul className="default list-unstyled">
                                    <li className="mb-2">Общительность</li>
                                    <li className="mb-2">Внимательность</li>
                                </ul>
                                <div className="fw-6 mb-3 mt-4">Условия:</div>
                                <ul className="default list-unstyled">
                                    <li className="mb-2">График работы: 5/2; 2/2 и другие;</li>
                                    <li className="mb-2">Ежемесячные премии-надбавки;</li>
                                    <li className="mb-2">Белая заработная плата, выплата 2 раза в месяц</li>
                                </ul>
                            </div>
                            <button type="button" onClick={() => setRoll((roll) ? false : true)} className="bb-solid mt-3 mt-md-4">
                                {
                                    (roll)?
                                    'Свернуть'
                                    : 'Развернуть'
                                }
                            </button>
                        </li>
                    </ul> */}
            </section>
        </main>
    );
};

export default Vacancy;

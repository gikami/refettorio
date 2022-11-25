import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Context } from "../index";
import { HOME_ROUTE } from "./../utils/consts";
import ProductItem from "../components/ProductItem";
const Favorites = () => {
    const { favorite } = useContext(Context)
    const [updateState, setUpdateState] = useState(false);
    const removeAllFavorite = () => {
        favorite.removeAllFavorite()
        setUpdateState(!updateState)
    }
    useEffect(() => {
        document.title = "Избранное"
    }, [])
    if (favorite && favorite.favorite.length > 0) {
        return (
            <main className='pt-4 pt-lg-5'>
                <section className="mb-8">
                    <div className="container">
                        <div className="d-sm-flex justify-content-between align-items-center mb-4 mb-md-5">
                            <h1 className="inner mb-sm-0">Сравнение</h1>
                            <button type="button" className="sec-font primary fs-11 fw-5" onClick={removeAllFavorite}>Очистить список</button>
                        </div>

                        <div className="row row-cols-2 row-cols-sm-3 row-cols-xl-4 gx-2 gy-3 g-md-4">
                            {
                                favorite.favorite.map((favorite, i) => <ProductItem key={i} product={favorite} />)
                            }
                        </div>
                    </div>
                </section>
            </main>
        )
    } else {
        return (
            <main className='pt-4 pt-lg-5'>
                <div className="container mb-4 mb-md-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={HOME_ROUTE}>Главная</Link></li>
                            <li className="breadcrumb-item"><a>Сравнение</a></li>
                        </ol>
                    </nav>
                </div>

                <section className="mb-8">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <h1 className="text-center">В сравнении ничего</h1>
                                <div className="text-center mb-4 mb-sm-5">Перейдите в каталог и добавляйте понравившиеся товары в этот список.</div>
                                <Link to={HOME_ROUTE} className="btn btn-2 mx-auto py-md-3">В каталог</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
};

export default Favorites;

import React, { useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Context } from "../../index";
import SideBar from "./components/menu";
import ProfileEdit from "./edit";
import ProfilePoints from "./points";
import ProfileAddress from "./address";
import ProfilePayments from "./payments";
import ProfileOrders from "./orders";
import ProfileTerms from "./terms";
import ProfileNotifications from "./notifications";

const Profile = () => {
    const { id } = useParams()
    const { user } = useContext(Context)

    useEffect(() => {
        document.title = 'Профиль'
    }, [])

    if (id === 'edit') {
        return (<ProfileEdit />);
        // } else if (id === 'points') {
        //     return (<ProfilePoints />);
    } else if (id === 'address') {
        return (<ProfileAddress />);
    } else if (id === 'payments') {
        return (<ProfilePayments />);
    } else if (id === 'orders') {
        return (<ProfileOrders />);
    } else if (id === 'terms') {
        return (<ProfileTerms />);
    } else if (id === 'notifications') {
        return (<ProfileNotifications />);
    } else {
        return (
            <main className='pt-4 pt-lg-5'>
                <section id="sec-13" className="mb-8">
                    <div className="container">
                        <div className="row">
                            <SideBar />
                            <div className="col-md-8 col-xl-7 col-xxl-6 offset-xl-1">
                                <form>
                                    <h1 className="d-none d-md-block">Личный кабинет</h1>
                                    <h5 className="gray-1">{(user.user.firstname) ? user.user.firstname : 'Имя'} {(user.user.lastname) ? user.user.lastname : 'Фамилия'}</h5>
                                    {user.user.phone ?
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="gray-1 fw-5 fs-11 mb-3">Телефон</legend>
                                            <div className="d-sm-flex">
                                                {user.user.phone}
                                            </div>
                                        </fieldset>
                                        : null
                                    }
                                    {user.birthday ?
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="gray-1 fw-5 fs-11 mb-3">День рождения</legend>
                                            <div className="d-sm-flex">
                                                {user.birthday}
                                            </div>
                                        </fieldset>
                                        : null
                                    }
                                    {user.user.sex ?
                                        <fieldset className="mb-4 mb-sm-5">
                                            <legend className="gray-1 fw-5 fs-11 mb-3">Мой пол</legend>
                                            <div className="d-sm-flex">
                                                {(user.user.sex) ? 'Мужской' : 'Женский'}
                                            </div>
                                        </fieldset>
                                        : null
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
};

export default Profile;

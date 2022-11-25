import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { NotificationContainer } from 'react-notifications'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/swiper-bundle.min.css'
import "./fonts.css";
import "./style.css";
import 'bootstrap/dist/js/bootstrap.min.js';
import jwt_decode from "jwt-decode";
import Header from './components/Header';

const App = observer(() => {
    const { user } = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            let token = localStorage.getItem('token');
            if (token) {
                let decodeToken = jwt_decode(token);
                user.setUser(decodeToken)
                user.setIsAuth(true)
                if (decodeToken) {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
    }, [])

    if (loading) {
        return <div className="loading"><img src="/images/loader.png" /></div>
    }
    return (
        <BrowserRouter>
            <Header />
            <AppRouter />
            <Footer />
            <ScrollToTop />
            <NotificationContainer />
        </BrowserRouter>
    );
});

export default App;

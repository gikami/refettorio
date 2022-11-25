import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";
import ProductStore from "./store/ProductStore";
import CartStore from "./store/CartStore";
import FavoriteStore from "./store/FavoriteStore";

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        cart: new CartStore(),
        favorite: new FavoriteStore(),
        product: new ProductStore(),
    }}>
        <App />
    </Context.Provider>,
    document.getElementById('root')
);


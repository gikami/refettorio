import Admin from "./pages/admin/index"
import { HOME_ROUTE, ADMIN_ROUTE, CART_ROUTE, CHECKOUT_ROUTE, PRODUCT_ROUTE, PROFILE_ROUTE, DELIVERY_ROUTE, ABOUT_ROUTE, SALE_ROUTE, FAVORITES_ROUTE, VACANCY_ROUTE, POLICY_ROUTE, CONTACTS_ROUTE, CATALOG_ROUTE, TERMS_ROUTE, OFFER_ROUTE } from "./utils/consts"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Sale from "./pages/Sale"
import Checkout from "./pages/Checkout"
import Catalog from "./pages/Catalog"
import Product from "./pages/Product"
import Profile from "./pages/profile/index"
import About from "./pages/About"
import Delivery from "./pages/Delivery"
import Contacts from "./pages/Contacts"
import Policy from "./pages/Policy"
import Terms from "./pages/Terms"
import Offer from "./pages/Offer"
import Favorites from "./pages/Favorites"
import PaySuccess from "./pages/Success"
import PayError from "./pages/Error"
import Vacancy from "./pages/Vacancy"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: ADMIN_ROUTE + '/:id',
        Component: Admin
    },
    {
        path: ADMIN_ROUTE + '/:id/:action',
        Component: Admin
    },
    {
        path: ADMIN_ROUTE + '/:id/page/:page',
        Component: Admin
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: PROFILE_ROUTE + '/:id',
        Component: Profile
    },
    {
        path: PROFILE_ROUTE + '/:id/:action',
        Component: Profile
    },
    {
        path: PROFILE_ROUTE + '/:id/:action/:actionId',
        Component: Profile
    },
]

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: ABOUT_ROUTE,
        Component: About
    },
    {
        path: SALE_ROUTE,
        Component: Sale
    },
    {
        path: SALE_ROUTE + '/:saleId',
        Component: Sale
    },
    {
        path: DELIVERY_ROUTE,
        Component: Delivery
    },
    {
        path: CONTACTS_ROUTE,
        Component: Contacts
    },
    {
        path: PRODUCT_ROUTE + '/:productId',
        Component: Product
    },
    {
        path: CATALOG_ROUTE + '/:catalogId',
        Component: Catalog
    },
    {
        path: CART_ROUTE,
        Component: Cart
    },
    {
        path: CHECKOUT_ROUTE,
        Component: Checkout
    },
    {
        path: FAVORITES_ROUTE,
        Component: Favorites
    },
    {
        path: VACANCY_ROUTE,
        Component: Vacancy
    },
    {
        path: POLICY_ROUTE,
        Component: Policy
    },
    {
        path: TERMS_ROUTE,
        Component: Terms
    },
    {
        path: OFFER_ROUTE,
        Component: Offer
    },
    {
        path: '/success',
        Component: PaySuccess
    },
    {
        path: '/error',
        Component: PayError
    },
]

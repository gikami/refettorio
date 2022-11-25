import { Link, useParams } from "react-router-dom"
import { ADMIN_ROUTE } from "../../../utils/consts"
const Menu = () => {
    const { id } = useParams()
    return (
        <nav>
            <ul>
                <li>
                    <Link to={ADMIN_ROUTE} className={(!id) ? 'active' : ''}>Главная</Link>
                </li>
                <li>
                    <Link to={ADMIN_ROUTE + '/categories'} className={(id === 'categories') ? 'active' : ''}>Категории</Link>
                </li>
                <li>
                    <Link to={ADMIN_ROUTE + '/products'} className={(id === 'products') ? 'active' : ''}>Товары</Link>
                </li>
                <li>
                    <Link to={ADMIN_ROUTE + '/orders'} className={(id === 'orders') ? 'active' : ''}>Заказы</Link>
                </li>
                <li>
                    <Link to={ADMIN_ROUTE + '/sales'} className={(id === 'sales') ? 'active' : ''}>Акции</Link>
                </li>
                <li>
                    <Link to={ADMIN_ROUTE + '/notifications'} className={(id === 'notifications') ? 'active' : ''}>Push уведомления</Link>
                </li>
            </ul>
        </nav>
    )
}
export default Menu;
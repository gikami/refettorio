import { Link } from "react-router-dom"
import { ADMIN_ROUTE } from "../../../utils/consts"
const Pagination = ({data, url}) => {
    let paginationArray = []
    for(var i = 1; data + 1 > i; i++){
        paginationArray.push(i)
    }

    return (
    <nav aria-label="...">
        <div className="pagination">
            {
            (paginationArray.length > 0 ) ? 
            paginationArray.map(item => (<li className="page-item"><Link className="page-link" to={ADMIN_ROUTE + '/'+ url +'/page/' + item}>{item}</Link></li>))
            : <li className="page-item"><Link className="page-link" to={ADMIN_ROUTE + '/'+ url +'/page/1'}>1</Link></li>
            }
        </div>
    </nav>
    )
}

export default Pagination;
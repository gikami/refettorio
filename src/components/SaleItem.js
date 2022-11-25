import React from 'react'
import { useHistory } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { SALE_ROUTE } from "../utils/consts"

const SaleItem = observer(({ sale }) => {
    const history = useHistory()
    return (
        <div className="col">
            <div className="sale">
                <a onClick={() => history.push(SALE_ROUTE + '/' + sale.id)}>
                    {(sale.image) ? <img key={sale.id} src={process.env.REACT_APP_API_URL + '/sale/' + sale.image} effect="blur" /> : null}
                </a>
                <div className="desc">{(sale.desc) ? sale.desc : 'Нет описания'}</div>
                <div className="d-flex justify-content-center">
                    <a onClick={() => history.push(SALE_ROUTE + '/' + sale.id)} type="button" className="add-to-cart btn btn-1 d-none d-md-block" >Подробнее</a>
                </div>
            </div>
        </div>
    )
})

export default SaleItem

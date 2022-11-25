import React, { useEffect, useState } from 'react'
import MetaTags from 'react-meta-tags'
import SaleList from "../components/SaleList"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { Modal, Button, CloseButton } from "react-bootstrap"
import { useParams, useHistory } from "react-router-dom"
import { fetchSale, fetchOneSale } from "../http/saleAPI"
import { HOME_ROUTE, SALE_ROUTE } from "../utils/consts"

const Sale = observer(() => {
    const history = useHistory();
    const { saleId } = useParams()
    const [sale, setSale] = useState(false)
    const [saleOne, setSaleOne] = useState()

    useEffect(() => {
        
        document.title = "Акции"
        if(!sale){
            fetchSale().then(data => {
                setSale(data)
            })
        }
    }, [])
    
    useEffect(() => {
        
        if(saleId){
            fetchOneSale(saleId).then(data => {
                setSaleOne(data)
            })
        }
        
    }, [saleId])
    
    if(saleId && saleOne){
        return (
            <>
                <MetaTags>
                    <title>{saleOne.title}</title>
                    <meta name="description" content={saleOne.title} />
                    <meta property="og:title" content={saleOne.title} />
                    <meta property="og:image" content={process.env.REACT_APP_API_URL + '/sale/' + saleOne.image} />
                </MetaTags>
                <div className="container p-3 p-md-5">
                    <div className="short-info row">
                        <div className="col-md-5">
                            <div className="img-prod mb-5 mb-md-0">
                                {(saleOne.image) ? <img className="w-100" src={process.env.REACT_APP_API_URL + '/sale/' + saleOne.image} alt={saleOne.title} /> : null}
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h1 className="h2 fw-6 mb-0">{saleOne.title}</h1>
                            </div>
                            <div className="text-secondary fs-14 mb-4"><span className="me-2">{(saleOne.desc) ? saleOne.desc : 'Нет описания'}</span></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }else{
        
        return (
            <main>
                <section className="sec-2 mb-8">
                    <div className="container">
                        <h1 className="h3 fw-6 mb-4 text-center text-md-start">Акции</h1>
                        <SaleList data={sale} />
                    </div>
                </section>
            </main>
        )
        
    }
})

export default Sale;
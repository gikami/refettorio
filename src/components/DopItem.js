import React, { useState, useContext } from 'react'
import { observer } from "mobx-react-lite"
import { Context } from "./../index"
import { LazyLoadImage } from 'react-lazy-load-image-component'

const DopItem = observer(({ dop }) => {
    const { product } = useContext(Context)
    const [checkDop, setCheckDop] = useState(false)

    const changeDop = () => {
        if (dop) {
            if (product.product.dop) {
                var dopYes = product.product.dop.find(item => item.id === dop.id)
                if (dopYes) {
                    product.product.dop = product.product.dop.filter(item => item.id !== dop.id)
                    //product.product.price = Number(product.product.price) - Number(dop.price)
                    setCheckDop(false)
                } else {
                    product.product.dop.push(dop)
                    //product.product.price = Number(product.product.price) + Number(dop.price)
                    setCheckDop(true)
                }
            } else {
                product.product.dop = [dop]
                //product.product.price = Number(product.product.price) + Number(dop.price)
                setCheckDop(true)
            }
            product.setProduct(product.product)
        }
    }

    return (
        <div onClick={changeDop} className={(checkDop && product.product.dop.length > 0) ? 'ingredient active' : 'ingredient'}>
            <LazyLoadImage src={(dop.image) ? process.env.REACT_APP_API_URL + '/dop/' + dop.image : '/images/no-image.jpg'} effect="blur" alt={dop.title} />
            <div>
                <div className="title">{dop.title}</div>
                <div className="mt-1 gray fw-7">{dop.price} ₽</div>
            </div>
        </div>
    )
})

export default DopItem

import React, { useContext, useEffect } from 'react'
import { Context } from "../index"

const Radio = () => {
    const { product, cart } = useContext(Context)
    const size = (product.product) ? product.product.attribute[1][0] : false
    const list = (product.product) ? product.product.attribute[1] : false

    const changeSize = (e) => {
        product.product.price = e.target.value
        product.product.dop = []
        product.product.size = {
            id: e.target.attributes.dataId.value,
            title: e.target.attributes.dataTitle.value
        }
        product.product.weight = e.target.attributes.dataWeight.value
        product.setProduct(product.product)
    }

    return (
        (list) &&
        <div className="switch">
            {
                list.map((radio, i) =>
                    <label key={i} className='text-form'>
                        <input type="radio" id={"radio" + radio.id} name={"radio" + radio.group} dataId={radio.id} dataWeight={radio.weight} dataTitle={radio.title} value={radio.price} onChange={changeSize} defaultChecked={size.id == radio.id} />
                        <div className="switch-option">{radio.title}</div>
                    </label>
                )
            }
        </div>
    )
}

export default Radio
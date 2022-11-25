import React from 'react'
import { observer } from "mobx-react-lite"
import DopItem from "./../components/DopItem"

const DopList = observer(({ product, dop }) => {
    if (product && dop) {
        return (
            <>
                <div className="row">
                    {
                        dop.map(item => {
                            return (
                                <div className="col-6 col-md-4 p-2 " key={item.id}>
                                    <DopItem product={product} dop={item} />
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    } else {
        return false
    }
})

export default DopList

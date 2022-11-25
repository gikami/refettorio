import React, { useContext } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import ProductItem from "./ProductItem"

const ProductList = observer((catalog = false) => {
    const { product } = useContext(Context)

    if(catalog){
        return (product.products && product.products.length > 0) ? <>
                <div className="element">
                    <h2 className="mb-4">{product.selectedCategory.title}</h2>
                </div>
                <div className="row row-cols-sm-3 row-cols-xl-4 gx-3 gy-3 g-md-4">
                    {
                        product.products && product.products.map(product => <ProductItem key={product.id} product={product} />)
                    }

                </div>
            </>
            : null
    }else{
        return product.products && product.products.map(category => {
            return (category.products && category.products.length > 0) ? <>
                <div className="element">
                    <h2 className="mb-4">{category.title}</h2>
                </div>
                <div className="row row-cols-sm-3 row-cols-xl-4 gx-3 gy-3 g-md-4">
                    {
                        category.products && category.products.map(product => <ProductItem key={product.id} product={product} />)
                    }

                </div>
            </>
            : null
        })
    }
});

export default ProductList
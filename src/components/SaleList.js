import React from 'react';
import { observer } from "mobx-react-lite";
import SaleItem from "./SaleItem";

const SaleList = observer(({data}) => {
    return (<div className="row row-cols-sm-3 row-cols-xl-4 gx-3 gy-3 g-md-4" > {
        (data) && data.map((sale, i) =>
            <SaleItem key={i} sale={sale} />
        )
    } </div>
    );
});

export default SaleList;
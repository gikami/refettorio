import { $authHost, $host } from "./index";

export const getAikoStreets = async () => {
    const data = await $authHost.get('/admin/getAikoStreets')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const getAikoCategories = async () => {
    const data = await $authHost.get('/admin/getAikoCategories')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const getAikoProducts = async () => {
    const data = await $authHost.get('/admin/getAikoProducts')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const sendAikoOrder = async () => {
    const data = await $authHost.post('/admin/sendAikoOrder')
    if (data) {
        return data.data
    } else {
        return false
    }
}
export const getCategories = async (page = 1, limit = 20) => {
    const { data } = await $host.get('/admin/getCategories', {
        params: {
            page, limit
        }
    })
    return data
}
export const getCategory = async (id) => {
    const { data } = await $host.get('/admin/getCategory', {
        params: {
            id
        }
    })
    return data
}
export const editCategory = async (category) => {
    const { data } = await $authHost.post('/admin/editCategory', category)
    return data
}
export const deleteCategory = async (category) => {
    const { data } = await $authHost.post('/admin/deleteCategory', category)
    return data
}
export const createCategory = async (category) => {
    const { data } = await $authHost.post('/admin/createCategory', category)
    return data
}





export const getProducts = async (page = 1, limit = 20) => {
    const { data } = await $host.get('/admin/getProducts', {
        params: {
            page, limit
        }
    })
    return data
}
export const getProduct = async (id) => {
    const { data } = await $host.get('/admin/getProduct', {
        params: {
            id
        }
    })
    return data
}
export const editProduct = async (product) => {
    const { data } = await $authHost.post('/admin/editProduct', product)
    return data
}
export const deleteProduct = async (product) => {
    const { data } = await $authHost.post('/admin/deleteProduct', product)
    return data
}
export const createProduct = async (product) => {
    const { data } = await $authHost.post('/admin/createProduct', product)
    return data
}





export const getOrders = async (page = 1, limit = 20) => {
    const { data } = await $host.get('/admin/getOrders', {
        params: {
            page, limit
        }
    })
    return data
}
export const getOrder = async (id) => {
    const { data } = await $host.get('/admin/getOrder', {
        params: {
            id
        }
    })
    return data
}
export const editOrder = async (order) => {
    const { data } = await $authHost.post('/admin/editOrder', order)
    return data
}
export const deleteOrder = async (order) => {
    const { data } = await $authHost.post('/admin/deleteOrder', order)
    return data
}
export const createOrder = async (order) => {
    const { data } = await $authHost.post('/admin/createOrder', order)
    return data
}




export const getSales = async (page = 1, limit = 20) => {
    const { data } = await $host.get('/admin/getSales', {
        params: {
            page, limit
        }
    })
    return data
}
export const getSale = async (id) => {
    const { data } = await $host.get('/admin/getSale', {
        params: {
            id
        }
    })
    return data
}
export const editSale = async (sale) => {
    const { data } = await $authHost.post('/admin/editSale', sale)
    return data
}
export const deleteSale = async (sale) => {
    const { data } = await $authHost.post('/admin/deleteSale', sale)
    return data
}
export const createSale = async (sale) => {
    const { data } = await $authHost.post('/admin/createSale', sale)
    console.log(data)
    return data
}
export const sendPush = async (push) => {
    const { data } = await $authHost.post('/admin/sendPush', push)
    return data
}
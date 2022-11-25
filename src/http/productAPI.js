import { $authHost, $host } from "./index";

export const fetchCategory = async () => {
    const { data } = await $host.get('/category')
    return data
}
export const fetchCategoryOne = async (catalogId) => {
    const { data } = await $host.get('/category/' + catalogId)
    return data
}

export const fetchProducts = async (categoryId = false, page = 1, limit = 40, filter = '') => {
    const { data } = await $host.post('/product', { categoryId, page, limit, filter })
    return data
}

export const fetchRecommed = async (param, id = 1) => {

    if (param) {
        let array = JSON.parse(param)[0]
        if (array.type == 'poke' || array.type == 'sup' || array.type == 'napitki') {
            id = 2
        }

    }

    const { data } = await $host.get('/product/getrecommend', {
        params: {
            id
        }
    })
    return data
}

export const fetchOneProduct = async (id) => {
    const { data } = await $host.get('/product/' + id)
    return data
}

export const createReview = async (array) => {
    const { data } = await $host.post('/product/createReview', array)
    return data
}
import { $host } from "./index";

export const fetchPromo = async (array) => {
    let arrayPromo = {
        code: array.code ? array.code : '',
        total: array.total ? array.total : 0,
        user: array.user ? array.user : 0,
    }
    const { data } = await $host.post('/order/promo', arrayPromo)
    if (data) {
        return data
    } else {
        return 'Промокод не применен'
    }
}

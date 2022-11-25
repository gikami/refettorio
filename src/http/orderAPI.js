import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const setOrder = async (array) => {
    const { data } = await $host.post('/order/create', array)
    if (data) {
        return data
    } else {
        return false
    }
}
export const getOrder = async (array) => {
    const { data } = await $authHost.post('/order/getorder', array)
    if (data) {
        return jwt_decode(data)
    } else {
        return false
    }
}
export const getStreets = async (array) => {
    const { data } = await $host.get('/order/getStreets')
    if (data) {
        return data
    } else {
        return false
    }
}
export const getOrders = async (user) => {
    const { data } = await $authHost.post('/order/getorders', { user })
    if (data) {
        return data
    } else {
        return false
    }
}
export const deleteOrder = async (id) => {
    const { data } = await $authHost.post('/user/deleteorder', { id })
    if (data) {
        return jwt_decode(data)
    } else {
        return false
    }
}
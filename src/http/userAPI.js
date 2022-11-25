import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (phone) => {
    const { data } = await $host.post('/user/registration', { phone })
    //localStorage.setItem('token', data.token)
    return jwt_decode(data)
}
export const newPassword = async (phone) => {
    const { data } = await $host.post('/user/newpassword', { phone })
    if (data) {
        return data
    } else {
        return false
    }
}

export const login = async (phone, password) => {
    const { data } = await $host.post('/user/login', { phone, password })
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const edit = async (array) => {
    const { data } = await $authHost.post('/user/edit', array)
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const getAddress = async (user) => {
    const { data } = await $authHost.post('/user/getAllAddress', { user })
    return data
}
export const addAddress = async (array) => {
    const { data } = await $authHost.post('/user/address', array)
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const editAddress = async (array) => {
    const { data } = await $authHost.post('/user/editaddress', array)
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const deleteAddress = async (id) => {
    const { data } = await $authHost.post('/user/deleteaddress', { id })
    if (data) {
        localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    } else {
        return false
    }
}
export const check = async () => {
    const { data } = await $authHost.get('/user/auth')
    if (data && data.token) {
        localStorage.setItem('token', data.token)
    }
    return jwt_decode(data.token)
}
export const updatePoint = async () => {
    const { data } = await $authHost.post('/user/updatePoint')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
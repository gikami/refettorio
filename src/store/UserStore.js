import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    get birthday() {
        var monthNames = [
            "Января",
            "Февраля",
            "Марта",
            "Апреля",
            "Мая",
            "Июня",
            "Июля",
            "Августа",
            "Сентября",
            "Октября",
            "Ноября",
            "Декабря",
        ];
        if (this._user && this._user.birthday_day && this._user.birthday_month) {
            var text = this._user.birthday_day + ' ' + monthNames[this._user.birthday_month - 1]
            return text
        } else {
            return false
        }
    }
    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
}

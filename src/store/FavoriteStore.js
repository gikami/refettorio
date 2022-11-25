import { makeAutoObservable } from "mobx";

export default class FavoriteStore {
    constructor() {
        this._favorite = []
        makeAutoObservable(this)
        this.getData()
    }
    getData() {
        let data = localStorage.getItem('favorite');
        if (data) {
            this._favorite = JSON.parse(data);
        }
    }
    setFavorite(product) {
        let id_yes = Object.keys(this._favorite).find(ids => this._favorite[ids].id === product.id);
        if (id_yes) {
            this._favorite.splice(id_yes, 1);
            localStorage.setItem('favorite', JSON.stringify(this._favorite))
        } else {
            this._favorite.push(product)
            localStorage.setItem('favorite', JSON.stringify(this._favorite))
        }
    }
    checkFavorite(product) {
        let id_yes = (product && product.id) ? Object.keys(this._favorite).find(ids => this._favorite[ids].id === product.id) : false;
        return { status: (id_yes) ? true : false }
    }

    removeAllFavorite() {
        this._favorite = []
        localStorage.removeItem('favorite')
    }
    get favorite() {
        return this._favorite
    }
}

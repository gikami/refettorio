import { makeAutoObservable } from "mobx";

export default class CartStore {
    constructor() {
        this._cart = []
        this._total = 0
        this._size = 1
        this._sale = { text: '', total: 0 }
        this._promo = { text: '', total: 0 }
        this._deliveryMinDelivery = 1000
        this._deliveryMinPrice = 1000
        this._deliveryPrice = 0
        this._giftMinPrice = []
        this._gift = []
        makeAutoObservable(this)
        this.totalSum()
    }
    totalSum() {
        let data = localStorage.getItem('cart')
        // let pizza = { product: [], count: 0 }
        if (data) {
            this._total = 0
            this._cart = JSON.parse(data);
            this._cart.map(item => {
                if (item) {
                    // let param = (item.param) ? JSON.parse(item.param)[0].type : false
                    // if (param === 'pizza' && pizza.amount < 3 && item.type !== 'gift') {
                    //     let id_yes = Object.keys(pizza.product).find(ids => pizza.product[ids].id === item.id)
                    //     if (id_yes) {
                    //         pizza.product.amount = pizza.product.amount + this._cart[id_yes].amount
                    //     } else {
                    //         pizza.product.push(item)
                    //         pizza.amount = pizza.amount + item.amount
                    //     }
                    // }
                    this._total += item.price * item.amount
                    if (item.dop) {
                        item.dop.map(dop => this._total += dop.price)
                    }
                }
            })
            // if (pizza.amount >= 3 && !Object.keys(this._cart).find(ids => this._cart[ids].type === 'gift')) {
            //     this._sale = { text: 'Скидка по акции - Третья пицца в подарок', total: Math.min(...pizza.product.map(item => item.price)) }
            //     this._total = this._total - this._sale.total
            // } else {
            //     this._sale = { text: '', total: 0 }
            // }
            // let promo = localStorage.getItem('promo')
            // if (promo) {
            //     this._promo = JSON.parse(promo)
            //     this._total = this._total - this._promo.price
            // }
        }
    }
    setCart(product, dop = false) {
        if (!product || 0 === product.length) {
            return false
        }
        product.amount = 1
        let id_yes = Object.keys(this._cart).find(ids => {
            let cart = this._cart[ids]
            cart.amount = 1
            return JSON.stringify(cart) === JSON.stringify(product)
        });

        if (product.gift) {
            if (id_yes) {
                this._cart.splice(id_yes, 1);
            } else {
                product.amount = 1
                this._cart.push(product)
            }
            // } else if (dop) {

            //     if (id_yes && this._cart[id_yes].dop && this._cart[id_yes].dop.length > 0) {
            //         let dop_yes = Object.keys(this._cart[id_yes].dop).find(ids => this._cart[id_yes].dop[ids].id === dop.id)
            //         if (dop_yes) {
            //             this._cart[id_yes].dop = this._cart[id_yes].dop.filter((item) => item.id !== dop.id)
            //         } else {
            //             this._cart[id_yes].dop.push(dop)
            //         }
            //     } else {
            //         this._cart[id_yes].dop = [dop]
            //     }

        } else {
            if (id_yes) {
                this._cart[id_yes].amount += 1
            } else if (product) {
                this._cart.push(product)
            }
        }

        localStorage.setItem('cart', JSON.stringify(this._cart))
        this.totalSum()
    }
    setPromo(promo) {
        if (promo) {
            this._promo = promo
            localStorage.setItem('promo', JSON.stringify(this._promo))
            this.totalSum()
        }
    }
    removePromo() {
        this._promo = { text: '', total: 0 }
        localStorage.removeItem('promo')
        this.totalSum()
    }
    addGift(id) {
        this.setCart(this._gift[id])
    }
    getSize(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            return (id_yes && this._cart[id_yes].size) ? this._cart[id_yes].size : 1
        }
    }
    setSize(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id);
            if (id_yes) {
                this._cart[id_yes].size = product.size
                this._cart[id_yes].price = product.price
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    getCartProductCount(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id && this._cart[ids].price === product.price);
            if (id_yes) {
                return this._cart[id_yes].amount
            }
        }
    }
    setCartCountPlus(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id && this._cart[ids].price === product.price);
            if (id_yes) {
                this._cart[id_yes].amount += 1
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    setCartCountMinus(product) {
        if (product) {
            let id_yes = Object.keys(this._cart).find(ids => this._cart[ids].id === product.id && this._cart[ids].price === product.price);
            if (id_yes) {
                if (this._cart[id_yes].amount > 1) {
                    this._cart[id_yes].amount -= 1
                } else if (this._cart.length > 0) {
                    this._cart.splice(id_yes, 1);
                }
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    setCartCount(product, num) {
        if (product && num) {
            product.amount = num
            this._cart.push(product)
            localStorage.setItem('cart', JSON.stringify(this._cart))
            this.totalSum()
        }
    }
    checkCart(product, dop = false) {
        let id_yes = (product && product.id) ? Object.keys(this._cart).find(ids => this._cart[ids].id === product.id) : false
        if (id_yes && dop) {
            let dop_yes = (this._cart[id_yes].dop) ? Object.keys(this._cart[id_yes].dop).find(ids => this._cart[id_yes].dop[ids].id === dop.id) : false
            return { status: (dop_yes) ? true : false, count: (id_yes && this._cart[id_yes]) ? this._cart[id_yes].amount : 1 }
        } else if (id_yes) {
            return { status: (id_yes) ? true : false, count: (id_yes && this._cart[id_yes]) ? this._cart[id_yes].amount : 1 }
        } else {
            return { status: false, count: 1 }
        }
    }
    removeCartProduct(product) {
        if (product) {
            product.amount = 1
            let id_yes = Object.keys(this._cart).find(ids => {
                let cart = this._cart[ids]
                cart.amount = 1
                return JSON.stringify(cart) === JSON.stringify(product)
            });
            if (id_yes) {
                this._cart.splice(id_yes, 1);
                localStorage.setItem('cart', JSON.stringify(this._cart))
            }
            this.totalSum()
        }
    }
    removeCartDop(product, dop) {
        if (product && dop) {
            product.amount = 1
            let id_yes = Object.keys(this._cart).find(ids => {
                let cart = this._cart[ids]
                cart.amount = 1
                return JSON.stringify(cart) === JSON.stringify(product)
            });
            if (id_yes) {
                let dop_yes = (this._cart[id_yes].dop) ? Object.keys(this._cart[id_yes].dop).find(ids => this._cart[id_yes].dop[ids].id === dop.id) : false;
                if (dop_yes) {
                    this._cart[id_yes].dop.splice(dop_yes, 1);
                    localStorage.setItem('cart', JSON.stringify(this._cart))
                }
            }
            this.totalSum()
        }
    }
    removeAllCart() {
        this._cart = []
        localStorage.removeItem('cart')
        this.totalSum()
    }
    get cart() {
        return this._cart
    }
    get deliveryMinDelivery() {
        return this._deliveryMinDelivery
    }
    get deliveryMinPrice() {
        return this._deliveryMinPrice
    }
    get deliveryPrice() {
        return this._deliveryPrice
    }
    get total() {
        return this._total
    }
    get sale() {
        return this._sale
    }
    get promo() {
        return this._promo
    }
    giftMinPrice(id) {
        return this._giftMinPrice[id]
    }
    gift(id) {
        return this._gift[id]
    }
}

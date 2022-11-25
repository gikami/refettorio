const { useAlfaBank, toBynPenny } = require('alfabank');
class Pay {
      async alfa(data, products, result) {
            const alfaBank = useAlfaBank({
                  //token: process.env.ALFA_TOKEN,
                  userName: process.env.ALFA_LOGIN,
                  password: process.env.ALFA_PASSWORD,
                  language: 'ru'
            });
            // console.log(products)
            // console.log(data)
            const response = await alfaBank.register({
                  amount: toBynPenny(data.total),
                  orderNumber: result.id,
                  returnUrl: process.env.ALFA_URL_RETURN,
                  jsonParams: {
                        //email: data.email,
                        phone: data.phone,
                  },
                  // orderBundle: {
                  //       cartItems: {
                  //             items: products ? products : []
                  //       },
                  // },
            });
            if (response) {
                  return response;
            } else {
                  return 'Ошибка при оплате';
            }
      }
}
module.exports = new Pay()
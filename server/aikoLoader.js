require('dotenv').config()
const Aiko = require('./components/aikoTransport')
require('./db')
require('./models/models')
var fs = require('fs');

const getAiko = async () => {
      //let streets = await Aiko.getStreets()
      let categories = await Aiko.getCategories()
      let products = await Aiko.getProducts()

      // if (streets) {
      //       fs.writeFile('./unloading/streets.json', streets.city, function (err) {
      //             if (err) throw err;
      //             console.log('Файл создан или перезаписан.');
      //       });
      // }
      if (categories && categories.categoriesAll) {
            fs.writeFile('./unloading/categories.json', JSON.stringify(categories.categoriesAll), function (err) {
                  if (err) throw err;
                  console.log('Файл создан или перезаписан.');
            });
      }
      console.log(products)
      if (products && products.productsAll) {
            fs.writeFile('./unloading/products.json', JSON.stringify(products.productsAll), function (err) {
                  if (err) throw err;
                  console.log('Файл создан или перезаписан.');
            });
      }
}
getAiko();
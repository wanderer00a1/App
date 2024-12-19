const mongoose = require('mongoose');

const Product = require('./models/product');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Blito');
  console.log('Connected to MongoDB');
}

// const p = new Product({
//     name:'coconut',
//     price: 5.99,
//     Category:'Grocery'
// })

// p.save()
//     .then(p => {
//         console.log(p)
//     })
//     .catch(e =>{
//         console.log(e)
//     })

const rootProduct = [
        { name: 'Potato Chips', price: 2.49, Category: 'Snacks' },
        { name: 'Orange Juice', price: 3.99, Category: 'Drinks'},
        { name: 'Shampoo', price: 6.99, Category: 'Personalcare'},
        {name: 'Mixed Pack', price: 10.99, Category: 'Snacks' }
    ]

Product.insertMany(rootProduct)
    .then(r =>{
        console.log(r);
    })
    .catch(e =>{
        console.log(e);
    })
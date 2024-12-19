const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:['Grocery','Snacks','Drinks','Personalcare']
    }


})

const Product = new mongoose.model('Product',productSchema);

module.exports = Product;
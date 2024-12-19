const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Blito');
  console.log('Connected to MongoDB');
}

const categories = ['Grocery','Snacks','Drinks','Personalcare'];

app.set('views',path.join(__dirname, 'views'));
//Error: Failed to lookup view "products/index" in views directory "D:\Project"
app.set('view engine','ejs');

//middleware part 
app.use(express.urlencoded({extended: true}))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use(express.static('public'));


app.get('/products',async (req,res) =>{
  const { category} = req.query;
  if(category){
    const products = await Product.find({category});
    res.render('products/index',{products,categories, category});
  }
  else{
    const products = await Product.find({});
    res.render('products/index',{products,categories,category:'All'});
  }  
})

//to the page for creating add items
app.get('/products/new', (req,res) =>{
  res.render('products/new',{categories});
})

app.post('/products', async (req,res) =>{
  console.log(req.body)
  const newProduct = new Product(req.body);
  //have to use app.use(express.urlencoded({extended: true})) to parse that content middleware part
  await newProduct.save();
  res.redirect(`products/${newProduct._id}`)
})


app.get('/products/:id', async (req,res) =>{
  //:id coz its dynamic path
  //use the id to fetch a product from the database
  const {id} = req.params;
  const product = await Product.findById(id);
  res.render('products/show',{product});
})

//has to use method override 
app.get('/products/:id/edit', async (req,res) =>{
  const {id} = req.params;
  const product = await Product.findById(id);
  res.render('products/edit',{product, categories});
})

app.put('/products/:id', async (req,res) =>{
  const {id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body,{runValidators:true,new:true})
  res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async (req,res) =>{
  const {id} = req.params;
  const delProduct = await Product.findByIdAndDelete(id);
  res.redirect('/products');
})


app.listen('3300',() =>{
    console.log("Server is now Running -------->")
})
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');
const appError = require('./appError');
const { handleAsync } = require('./appError');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ErrorAsync');
  console.log('Connected to MongoDB');
}

const categories = ['Grocery', 'Snacks', 'Drinks', 'Personalcare'];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

function handleAsync(fn){
    return function(req,res,next){
      fn(req,res,next).catch(e => next(e));
    }
  }

app.get('/products', handleAsync(async (req, res, next) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render('products/index', { products, categories, category });
  } else {
    const products = await Product.find({});
    res.render('products/index', { products, categories, category: 'All' });
  }
}));

app.get('/products/new', (req, res) => {
  res.render('products/new', { categories });
});

app.post('/products', handleAsync(async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`products/${newProduct._id}`);
}));

app.get('/products/:id', handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new appError('Not found ', 404);
  }
  res.render('products/show', { product });
}));

app.get('/products/:id/edit', handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new appError('Not found ', 404);
  }
  res.render('products/edit', { product, categories });
}));

app.put('/products/:id', handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/products/${product._id}`);
}));

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const delProduct = await Product.findByIdAndDelete(id);
  res.redirect('/products');
}));

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something Went Wrong' } = err;
  res.status(status).send(message);
});

app.listen('3300', () => {
  console.log("Server is now Running -------->");
});

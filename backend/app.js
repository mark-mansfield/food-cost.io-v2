const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const dishRoutes = require('./routes/dishes');
const userRoutes = require('./routes/users');
const ingredientsRoutes = require('./routes/ingredients');
const menuRoutes = require('./routes/menus');
const supplierRoutes = require('./routes/suppliers');
const accountRoutes = require('./routes/accounts');
// app.use(bodyParser.urlencoded({ extended: false }));
// mongoDb creds
// user mark
// 'mongodb+srv://mark:' + process.env.MONGO_ATLAS_PASSWORD + '@food-cost-cluster-zlgfs.mongodb.net/food-cost-cluster'

// 'mongodb+srv://mark:8koqWcF9cU6FPwgU@food-cost-cluster-zlgfs.mongodb.net/test?retryWrites=true'



mongoose
  .connect(
    'mongodb+srv://mark:8koqWcF9cU6FPwgU@food-cost-cluster-zlgfs.mongodb.net/food-cost-cluster'
    , { useNewUrlParser: true })
  .then(() => {
    console.log('connected to database');
  })
  .catch((e) => {
    console.log('connection failed', e);
    console.error();
  });

app.use(bodyParser.json());

// create a middlewear to allow CORS
// add next to prevent a timeout or endless loop
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  next();
});

// routes loaded from separate files get forwarded
// http:localhost:3000 -> /trunk/route = '/api/users'  ('api/users' wont work )
app.use('/api/users', userRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/accountServices', accountRoutes);
module.exports = app;

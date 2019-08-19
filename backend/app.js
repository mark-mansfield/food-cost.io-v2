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
// pass jlFedsE5nKIF7i9z
// mongodb+srv://mark:<PASSWORD>@food-cost-cluster-zlgfs.mongodb.net/test?retryWrites=true
// jlFtdiE5nKIF7i9z
mongoose
  .connect('mongodb+srv://mark:jlFtdiE5nKIF7i9z@food-cost-cluster-zlgfs.mongodb.net/food-cost-cluster')
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('connection failed');
    console.error();
  });

app.use(bodyParser.json());

// create a middlewear to allow CORS
// add next to prevent a timeout or endless loop
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, PATCH, DELETE, OPTIONS');
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

const mongoose = require('mongoose');

const dishesSchema = mongoose.Schema({
  customerId: String,
  dishes: Array
});

module.exports = mongoose.model('Dish', dishesSchema);

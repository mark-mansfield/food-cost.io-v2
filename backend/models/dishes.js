const mongoose = require('mongoose');

const customerDishesSchema = mongoose.Schema({
  customerId: String,
  dishes: Array
});

module.exports = mongoose.model('CustomerDish', customerDishesSchema);

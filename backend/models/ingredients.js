const mongoose = require('mongoose');

const ingredientsSchema = mongoose.Schema({
  customerId: String,
  ingredients: Array
});

module.exports = mongoose.model('Ingredients', ingredientsSchema);

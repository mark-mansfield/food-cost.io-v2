const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
  customerId: String,
  name: String,
  uuid: String,
  ingredients: [],
  retail_price: String,
  cost: String,
  margin: String,
  description: String,
  recipe_method: String,
  plating_guide: String,
  progress: Number
});

module.exports = mongoose.model('Dish', dishSchema);

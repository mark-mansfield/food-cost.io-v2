const mongoose = require('mongoose');
const ingredientsSchema = mongoose.Schema({
  customerId: String,
  ingredients: Array,
  suppliers: Array,
  categories: Array,
  unit_types: Array
});

module.exports = mongoose.model('Ingredient', ingredientsSchema);

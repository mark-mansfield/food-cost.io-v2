const mongoose = require('mongoose');
const menuSchema = mongoose.Schema({
  hash_key: String,
  customerId: String,
  menus: []
});

module.exports = mongoose.model('Menu', menuSchema);

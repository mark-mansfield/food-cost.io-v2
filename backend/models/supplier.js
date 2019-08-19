const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
  customerId: String,
  suppliers: Array
});

module.exports = mongoose.model('Supplier', supplierSchema);

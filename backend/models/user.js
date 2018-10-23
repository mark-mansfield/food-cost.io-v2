const mongoose = require('mongoose');

// npm install --save mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator'); // plugin hook

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// define the plugin to be run on this schema so we can show errors if a unique error is generated
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);

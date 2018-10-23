const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
const User = require('../models/dish');

// moved the user routes to a controllers directory in the backend
;
const UserController = require('../controllers/users');

router.post("/signup" , UserController.createUser);
router.post("/login" , UserController.loginUser);
// export the router
module.exports = router;

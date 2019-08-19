const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users');

router.post('/createUser', UserController.createUser);
router.post('/login', UserController.loginUser);
// export the router
module.exports = router;

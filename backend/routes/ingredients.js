const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
const Ingredient = require('../models/ingredients');
const checkAuth = require('../middlewear/check-auth');

const IngredientsController = require('../controllers/ingredients');

router.get("/:custId" , IngredientsController.getCustomerIngredients);
router.put("/:custId" , IngredientsController.putCustomerIngredients);
// export the router
module.exports = router;

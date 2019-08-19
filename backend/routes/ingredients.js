const express = require('express');
const router = express.Router();
const extractFile = require('../middlewear/file');
const IngredientsController = require('../controllers/ingredients');

router.get('/:custId', IngredientsController.getCustomerIngredients);
router.put('/:custId', IngredientsController.putCustomerIngredients);
router.post('/:custId/import', extractFile, IngredientsController.importCustomerIngredients);

// export the router
module.exports = router;

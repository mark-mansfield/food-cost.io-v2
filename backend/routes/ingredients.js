const express = require('express');
const router = express.Router();
const extractFile = require('../middlewear/file');
const IngredientsController = require('../controllers/ingredients');

router.get('/:custId', IngredientsController.getCustomerIngredients);
router.put('/:custId/update', IngredientsController.updateCustomerIngredient);
router.delete('/:custId/delete', IngredientsController.deleteCustomerIngredient);
router.post('/:custId/add', extractFile, IngredientsController.addCustomerIngredient);
router.post('/:custId/uploadCsvFile', extractFile, IngredientsController.uploadCsvFile);
router.post('/:custId/import', extractFile, IngredientsController.importCustomerIngredients);

// export the router
module.exports = router;

const express = require('express');
const router = express.Router();

const AccountsController = require('../controllers/accounts');
router.post('/initMenuDoc', AccountsController.initMenuDoc);
router.post('/initIngredientsDoc', AccountsController.initIngredientsDoc);
router.post('/initSuppliersDoc', AccountsController.initSuppliersDoc);
router.post('/initDishesDoc', AccountsController.initDishesDoc);
router.post('/validateAccount', AccountsController.validateAccount);
module.exports = router;

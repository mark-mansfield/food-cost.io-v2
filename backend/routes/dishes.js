const express = require('express');
const router = express.Router();
const DishesController = require('../controllers/dishes');

router.get('/:custId/:id', DishesController.getCustomerDish);

router.get('/:custId', DishesController.getCustomerDishes);
router.put('/:custId/update', DishesController.updateCustomerDish);
router.post('/:custId/delete', DishesController.deleteCustomerDish);
router.post('/:custId', DishesController.addCustomerDish);

// export the router
module.exports = router;

const express = require('express');
const router = express.Router();

// moved the menu routes to a controller directory in the backend
const SuppliersController = require('../controllers/suppliers');
router.get('/:custId', SuppliersController.getSuppliers);
router.put('/:custId', SuppliersController.putSuppliers);
router.post('/:custId', SuppliersController.postSuppliers);
// export the router
module.exports = router;

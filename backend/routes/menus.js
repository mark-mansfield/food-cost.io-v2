const express = require('express');
const router = express.Router();

// moved the menu routes to a controller directory in the backend
const MenusController = require('../controllers/menus');
router.get('/:custId', MenusController.getMenus);
router.put('/:custId', MenusController.putMenus);
router.post('/:custId', MenusController.postMenu);
// export the router
module.exports = router;

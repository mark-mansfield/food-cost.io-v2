// we need to access our models
const Menus = require('../models/menu');
const checkAuth = require('../middlewear/check-auth');

// add new menu
exports.postMenu = ('',
checkAuth,
(req, res, next) => {
  const menu = new Dish(req.body);
  console.log(dish);
  Menu.save(menu).then(result => {
    if (result.n > 0) {
      res.status(201).json({ message: 'Menu added successfully' });
    } else {
      res.status(401).json({ message: 'There was a problem' });
    }
  });
});

exports.putMenus = ('/:custId',
checkAuth,
(req, res, next) => {
  Menus.updateOne({ customerId: req.params.custId }, req.body)
    .then(result => {
      if (result.n > 0) {
        res.status(201).json({ message: 'Menu updated successfully' });
      } else {
        res.status(401).json({ message: 'There was a problem with your data' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't Update Menu!"
      });
    });
});

exports.getMenus = ('/:custId',
checkAuth,
(req, res, next) => {
  Menus.findOne({ customerId: req.params.custId })
    .then(document => {
      if (document) {
        res.status(200).json(document);
      } else {
        res.status(404).json({ message: "Customer's Menus Doc not found." });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Menus Failed!'
      });
    });
});

exports.deleteMenu = (req, res, next) => {
  Menu.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'deletion successful' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting Menus Failed!'
      });
    });
};

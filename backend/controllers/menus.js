// we need to access our models
const Menus = require('../models/menu');
const checkAuth = require('../middlewear/check-auth');

// add new menu
exports.addMenu =
  (':/custId',
  checkAuth,
  (req, res, next) => {
    const menu = req.body;
    console.log(menu);
    Menus.update({ customerId: req.params.custId }, { $push: { menus: menu } })
      .then(result => {
        if (result.nModified > 0) {
          res.status(200).json({ nModified: result.nModified });
          return;
        }
        res.status(406).json({ nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({ message: error });
      });
  });

// update nested document
exports.updateMenus =
  ('/:custId',
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

exports.getMenus =
  ('/:custId',
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

exports.deleteMenu =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    console.log(req.body.id);
    Menus.update({ customerId: req.params.custId }, { $pull: { menus: { id: req.body.id } } }, { multi: false })
      .then(result => {
        if (result.nModified === 0) {
          res.status(406).json({ nModified: result.nModified });
          return;
        }
        res.status(200).json({ nModified: result.nModified });
        return;
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: 0
        });
      });
  });

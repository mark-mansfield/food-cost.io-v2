// we need to access our models
const Suppliers = require('../models/supplier');
const checkAuth = require('../middlewear/check-auth');

// add object
exports.postSuppliers = ('',
checkAuth,
(req, res, next) => {
  const supplier = new Supplier(req.body);
  console.log(supplier);
  Suppliers.save(supplier).then(result => {
    if (result.n > 0) {
      res.status(201).json({ message: 'Supplier added successfully' });
    } else {
      res.status(401).json({ message: 'There was a problem' });
    }
  });
});

exports.putSuppliers = ('/:custId',
checkAuth,
(req, res, next) => {
  Suppliers.updateOne({ customerId: req.params.custId }, req.body)
    .then(result => {
      if (result.n > 0) {
        res.status(201).json({ message: 'Supplier updated successfully' });
      } else {
        res.status(401).json({ message: 'There was a problem with your data' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't Update Supplier!"
      });
    });
});

exports.getSuppliers = ('/:custId',
checkAuth,
(req, res, next) => {
  console.log(req.params.custId);
  Suppliers.findOne({ customerId: req.params.custId })

    .then(document => {
      if (document) {
        res.status(200).json(document);
      } else {
        res.status(404).json({ message: "Customer's Suppliers Doc not found." });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Suppliers Failed!'
      });
    });
});

exports.deleteSuppliers = (req, res, next) => {
  Suppliers.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
        message: 'Deleting Suppliers Failed!'
      });
    });
};

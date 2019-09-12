// we need to access our models
const Supplier = require('../models/supplier');
const checkAuth = require('../middlewear/check-auth');

// add record to document
exports.postSuppliers =
  ('/custId',
  checkAuth,
  (req, res, next) => {
    const supplier = req.body;
    Supplier.update({ customerId: req.params.custId }, { $push: { suppliers: supplier } })
      .then(result => {
        console.log(result);
        res.status(200).json({ nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error
        });
      });
  });







  // update record in document
exports.putSuppliers =
  ('/custId',
  checkAuth,
  (req, res, next) => {
    const updatedSupplier = req.body;
    console.log(updatedSupplier);
    Supplier.update(
      { customerId: req.params.custId } /* finds the document */,
      { $set: { 'suppliers.$[elem]': updatedSupplier } } /* sets the nested target document's new value */,
      {
        multi: false,
        arrayFilters: [
          { 'elem.id': { $eq: updatedSupplier.id } }
        ] /* selects the nested document based on the id attribute*/
      }
    )
      .then(result => {
        console.log(result);
        if (result.nModified === 0) {
          res.status(406).json({ nModified: result.nModified });
          return;
        }
        res.status(200).json({ nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: 0
        });
      });
  });



exports.getSuppliers =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    console.log(req.params.custId);
    Supplier.findOne({ customerId: req.params.custId })

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

exports.deleteSupplier =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    console.log(req.body.id);
    Supplier.update({ customerId: req.params.custId }, { $pull: { suppliers: { id: req.body.id } } }, { multi: false })
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

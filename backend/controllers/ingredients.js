const Ingredients = require('../models/ingredients');
const checkAuth = require('../middlewear/check-auth');

exports.getCustomerIngredients =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    Ingredients.findOne({ customerId: req.params.custId })
      .then(ingredients => {
        if (ingredients) {
          res.status(200).json(ingredients);
        } else {
          res.status(404).json({ n: 0 });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching customer' Ingredients Doc Failed!"
        });
      });
  });

exports.addCustomerIngredient =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    const ingredient = req.body;
    Ingredients.update({ customerId: req.params.custId }, { $push: { ingredients: ingredient } })
      .then(result => {
        console.log(result);
        res.status(200).json({ nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: result.nModified
        });
      });
  });

exports.updateCustomerIngredient =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    const ingredient = req.body;
    Ingredients.updateOne(
      { customerId: req.params.custId } /* finds the document */,
      { $set: { 'ingredients.$[elem]': ingredient } } /* sets the nested document new value*/,
      {
        multi: false,
        arrayFilters: [{ 'elem.id': { $eq: ingredient.id } }] /* selects the nested document based on the id attribute*/
      }
    )
      .then(result => {
        console.log(result);
        if (result.nModified === 0) {
          res.status(406).json({ message: 'couldnt find the ingredient to update it', nModified: result.nModified });
        }
        res.status(200).json({ message: 'ingredient updated', nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: 0
        });
      });
  });

exports.deleteCustomerIngredient =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    const ingredient = req.body;

    Ingredients.update(
      { customerId: req.params.custId },
      { $pull: { ingredients: { id: ingredient.id } } },
      { multi: false }
    )
      .then(result => {
        if (result.nModified === 0) {
          res.status(406).json({ nModified: result.nModified });
        }
        res.status(201).json({ nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: result.nModified
        });
      });
  });

exports.uploadCsvFile =
  ('/:custId/uploadCsv',
  checkAuth,
  (req, res, next) => {
    const csvFilePath = req.file.path;
    const csv = require('csvtojson');
    csv()
      .fromFile(csvFilePath)
      .then(jsonObj => {
        res.status(201).json({ message: 'file uploaded successfully', data: jsonObj });
      });
  });

exports.importCustomerIngredients =
  ('/:custId/import',
  checkAuth,
  (req, res, next) => {
    const ingredients = req.body.ingredients;
    console.log(req.body);
    Ingredients.update({ customerId: req.params.custId }, { $set: { ingredients: ingredients } })
      .then(result => {
        console.log(result);
        res.status(200).json({ nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: result.nModified
        });
      });
  });

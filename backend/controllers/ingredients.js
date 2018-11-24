const Ingredients = require('../models/ingredients');
const checkAuth = require('../middlewear/check-auth');
const fs = require('fs');
const csvtojsonV2 = require('csvtojson/v2');
// const multer = require('multer');

// const MIME_TYPE_MAP = {
//   'text/csv': 'csv',
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
// };

// const storage = multer.diskStorage({
//   destination: (req, filename, callback) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error('Invalid mime type');
//     if (isValid) {
//       error = null;
//     }
//     //call back params (errors, path relative to server.js)
//     callback(error, 'backend/uploads');
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname
//       .toLowerCase()
//       .split(' ')
//       .join('-');
//     const extension = MIME_TYPE_MAP[file.mimetype];
//     callback(null, name + '-' + Date.now() + '.' + extension);
//   }
// });

exports.getCustomerIngredients = ('/:custId',
checkAuth,
(req, res, next) => {
  Ingredients.findOne({ customerId: req.params.custId })
    .then(ingredients => {
      if (ingredients) {
        res.status(200).json(ingredients);
      } else {
        res
          .status(404)
          .json({ message: "Customer's ingredients Doc not found." });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching customer' Ingredients Doc Failed!"
      });
    });
});

exports.putCustomerIngredients = ('/:custId',
checkAuth,
(req, res, next) => {
  console.log(req.body);
  Ingredients.updateOne({ customerId: req.params.custId }, req.body)
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res
          .status(201)
          .json({ message: 'Ingredients Doc updated successfully' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't Update Dish!"
      });
    });
});

exports.importCustomerIngredients = ('/:custId/import',
checkAuth,
(req, res, next) => {
  const csvFilePath = req.file.path;
  const csv = require('csvtojson');
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      res
        .status(201)
        .json({ message: 'file uploaded successfully', data: jsonObj });
    });
});

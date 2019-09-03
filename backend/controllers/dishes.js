const checkAuth = require('../middlewear/check-auth');
const Dish = require('../models/dishes');
// get dishes
exports.getCustomerDishes =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    Dish.findOne({ customerId: req.params.custId }).then(dishes => {
      if (dishes) {
        res.status(200).json(dishes);
      } else {
        res.status(404).json({ message: 'Dishes document not found.' });
      }
    });
  });

// get dish
exports.getCustomerDish =
  ('/:custId/:id',
  checkAuth,
  (req, res, next) => {
    Dish.findById(req.params.id)
      .then(dish => {
        if (dish) {
          res.status(200).json(dish);
          console.log(dish);
        } else {
          res.status(404).json({ message: 'Dish not found.' });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: 'Fetching Dish Failed!'
        });
      });
  });

// update dish
exports.updateCustomerDish =
  ('/custId',
  checkAuth,
  (req, res, next) => {
    const dish = req.body;
    Dish.updateOne(
      { customerId: req.params.custId } /* finds the document */,
      { $set: { 'dishes.$[elem]': dish } } /* sets the nested target document's new value */,
      {
        multi: false,
        arrayFilters: [{ 'elem.uuid': { $eq: dish.uuid } }] /* selects the nested document based on the id attribute*/
      }
    )
      .then(result => {
        console.log(result);
        if (result.nModified === 0) {
          res.status(406).json({ message: 'couldnt find the dish to update it', nModified: result.nModified });
        }
        res.status(200).json({ message: 'dish updated', nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: 0
        });
      });
  });

// delete  dish
exports.deleteCustomerDish =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    const dish = req.body;
    Dish.update({ customerId: req.params.custId }, { $pull: { dishes: { uuid: dish.uuid } } }, { multi: false })
      .then(result => {
        console.log(result);
        if (result.nModified === 0) {
          res.status(406).json({ message: 'couldnt find the dish to delete it', nModified: result.nModified });
        }
        res.status(200).json({ message: 'dish deleted', nModified: result.nModified });
      })
      .catch(error => {
        res.status(500).json({
          message: error,
          nModified: 0
        });
      });
  });

//  save dish
exports.addCustomerDish =
  ('/:custId',
  checkAuth,
  (req, res, next) => {
    const dish = req.body;
    console.log(req.body);
    Dish.update({ customerId: req.params.custId }, { $push: { dishes: dish } })
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json({
          message: error
        });
      });
  });

// ('/:custID',
// checkAuth,
// (req, res, next) => {
//   const dish = new CustomerDish(req.body);
//   dish.save().then(result => {
//     res.status(200).json({
//       message: 'Dish added successfully',
//       dish: dish
//     });
//   });
// });

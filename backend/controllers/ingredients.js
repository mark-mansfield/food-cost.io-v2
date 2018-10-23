const Ingredients = require('../models/ingredients');
const checkAuth = require('../middlewear/check-auth');

exports.getCustomerIngredients = ('/:custId', checkAuth, (req, res, next) => {

   Ingredients.findOne({ customerId: req.params.custId}).then (ingredients => {
    if (ingredients) {
      res.status(200).json(ingredients);
    } else {
      res.status(404).json({message: "Customer's ingredients Doc not found."})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching customer\' Ingredients Doc Failed!'
    });
  });
});

exports.putCustomerIngredients = ('/:custId', checkAuth , (req, res, next) => {
  Ingredients.updateOne({ customerId: req.params.custId }, req.body).then(result => {
  console.log(result);
  if (result.n > 0 ) {
    res.status(201).json({message: 'Ingredients Doc updated successfully'})
  } else {
    res.status(401).json({message: 'Not Authorized!'})
  }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Couldn\'t Update Dish!'
    });
  });
});

const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
const Dish = require('../models/dish');
const checkAuth = require('../middlewear/check-auth');

// get dishes
router.get('/:custID', checkAuth, (req, res, next) => {
  console.log(req.params.custID);
  Dish.find({ customerId: req.params.custID }).then(documents => {
    res.status(200).json({
      message: 'Dishes fetched successfully!',
      dishes: documents
    });
  });
});

// get dish
router.get('/:custID/:id', checkAuth, (req, res, next) => {
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
router.put('/:id', checkAuth, (req, res, next) => {
  Dish.updateOne({ _id: req.params.id }, req.body)
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(201).json({ message: 'Dish updated successfully', dish: req.body });
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

// delete  dish
router.delete('/:id', (req, res, next) => {
  Dish.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log(result);
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
});

//  save dish
router.post('', (req, res, next) => {
  const dish = new Dish(req.body);
  console.log(dish);
  dish.save(dish).then(result => {
    res.status(201).json({
      message: 'Dish added successfully',
      dish: dish
    });
  });
});

// export the router
module.exports = router;

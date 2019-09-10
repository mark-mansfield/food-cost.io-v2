const Menu = require('../models/menu');
const Ingredient = require('../models/ingredients');
const Supplier = require('../models/supplier');
const CustomerDish = require('../models/dishes');
const User = require('../models/user');

exports.initMenuDoc = (req, res, next) => {
  const menu = new Menu({
    hash_key: '',
    customerId: req.body.customerId,
    menus: []
  });

  menu.save().then(result => {
    console.log(result);
    if (result) {
      res.status(201).json({ payload: req.body });
    } else {
      res.status(401).json({ message: 'There was a problem' });
    }
  });
};

exports.initIngredientsDoc = (req, res, next) => {
  const ingredient = new Ingredient({
    customerId: req.body.customerId,
    ingredients: [],
    suppliers: [],
    categories: [],
    unit_types: ['kg', 'bunch', 'litre', 'single item']
  });

  ingredient.save().then(result => {
    console.log(result);
    if (result) {
      res.status(201).json({ payload: req.body });
    } else {
      res.status(401).json({ message: 'Customer ingredients doc was not added' });
    }
  });
};

exports.initDishesDoc = (req, res, next) => {
  const dish = new CustomerDish({
    customerId: req.body.customerId,
    dishes: []
  });

  dish.save().then(result => {
    console.log(result);
    if (result) {
      res.status(201).json({ result });
    } else {
      res.status(401).json({ message: 'Customer Dishes  doc was not added' });
    }
  });
};

exports.initSuppliersDoc = (req, res, next) => {
  const supplier = new Supplier({
    customerId: req.body.customerId,
    suppliers: []
  });
  supplier
    .save()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json({ message: 'customer not found: adding supplier doc' });
      } else {
        res.status(401).json({ message: 'supplier doc not added', code: 401 });
      }
    })
    .catch(error => {
      res.status(400).json({
        message: `${error.kind} ${error.stringValue} not found`
      });
    });
};

exports.validateAccount = (req, res) => {
  User.update(
    { _id: req.body.customerId },
    {
      $set: {
        firstTime: false
      }
    }
  )
    .then(result => {
      if (result) {
        res.status(201).json({ message: 'User account status changed' });
      } else {
        res.status(401).json({ message: 'User account status not changed' });
      }
    })
    .catch(error => {
      res.status(400).json({
        message: `${error.kind} ${error.stringValue} not found`
      });
    });
};

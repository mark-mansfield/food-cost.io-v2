const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const Menu = require('../models/menu');
// const Ingredient = require('../models/ingredients');
// const async = require('async');

exports.createUser = (req, res, next) => {
  const saltingRounds = 10;
  bcrypt.hash(req.body.password, saltingRounds).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      firstTime: true
    });

    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User Created',
          userId: result._id
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'User name taken'
        });
      });
  });
};


exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Username is incorrect!'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'password is incorrect!'
        });
      }

      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'this_should_be_longer', {
        expiresIn: '1h'
      });
      // send token to front end
      res.status(200).json({
        expiresIn: 3600,
        token: token,
        userId: fetchedUser._id,
        firstTime: fetchedUser.firstTime
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Authentication Failed for technical reasons!'
      });
    });
};

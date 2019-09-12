// check if we have a token attached to the request and that it is valid
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth Failed!' });
  }
};

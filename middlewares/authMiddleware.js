const jwt = require('jsonwebtoken');
const { Admin } = require('../models')

const SECRET_KEY = process.env.SECRET; // Use dotenv in real projects

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ status: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ status: false, message: 'Not authorized, no token' });
  }
};

module.exports = protect;

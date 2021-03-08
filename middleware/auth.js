const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
 
  const bearerToken = req.headers.authorization;
  if (!bearerToken) return res.status(401).send('Access denied. No token provided.');
  const token = bearerToken.split(" ");
  if (!token[1]) return res.status(401).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(token[1], 'ksdf'); //config.get('jwtPrivateKey')
    req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
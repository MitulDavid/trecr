//checks if the token is there in the header and gives appropriate response
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header('x-auth-token');

  //Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization denied' });
  }

  //Verify Token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};

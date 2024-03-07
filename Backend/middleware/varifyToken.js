const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  console.log("varify token")
  const {token} = req.body;
  console.log(req.body)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;

const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';

// Generate a JWT token for a user
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secretKey,
    { expiresIn: '96h' } 
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};


const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};

const jwt = require('jsonwebtoken');


exports.authenticateToken = async (req, res, next) => {

    
    try {
        const token = req.cookies.token;
    
      if (token) {
        
        let user = await jwt.verify(token, 'anirbanpaulpassword');

        
        req.phoneNumber = user.phoneNumber;

        next();
      } else {
        res.status(401).send(req.phoneNumber);
      }
    
    } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate token' });
    }
  };
const jwt = require('jsonwebtoken');
const SECRET_KEY = '7sn123';

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }
    
    jwt.verify(token, SECRET_KEY, (err, userData) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = userData;
        next();
    });
}

module.exports = { authenticateToken, SECRET_KEY };

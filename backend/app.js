// --------------------------
// 1) IMPORTS
// --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const SECRET_KEY = '7sn123';
// --------------------------
// 2) MIDDLEWARES
// --------------------------
app.use(cors({
    origin: 'http://localhost:5176',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

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
// --------------------------
// 3) DB Storage
// --------------------------
let users = [];


// --------------------------
// 4) ENDPOINTs
// --------------------------

//  Sign Up Endpoint
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { 
        id: users.length + 1, 
        name, 
        email, 
        password,          
        hashedPassword    
    };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: false });

    res.status(201).json({ message: 'User created', token });
});


//  Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: false });

    res.json({ message: 'Logged in successfully', token });
});



//  Profile Endpoint
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({
        name: user.name,
        email: user.email,
        jwt: req.cookies.token,
        hashedPassword: user.hashedPassword,
        unHashedPassword: user.password
    });
});

//  Logout Endpoint
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});


// --------------------------
// 4) START SERVER
// --------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

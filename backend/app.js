const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET_KEY = '7sn123';

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

//Storage
let users = [];

// --------------------------
//  Sign Up Endpoint
// --------------------------
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);

    // Generate a JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

    // Set token in cookie
    res.cookie('token', token, { httpOnly: true, secure: false });

    res.status(201).json({ message: 'User created', token });
});

// --------------------------
//  Login Endpoint
// --------------------------
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    // Set the token
    res.cookie('token', token, { httpOnly: true, secure: false });

    res.json({ message: 'Logged in successfully', token });
});

// --------------------------
//  JWT Authentication Middleware
// --------------------------
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
//  Protected Profile Endpoint
// --------------------------
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        message: 'This is your protected profile data'
    });
});

// --------------------------
//  Logout Endpoint
// --------------------------
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

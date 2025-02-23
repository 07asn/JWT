// --------------------------
// 1) IMPORTS
// --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;
const SECRET_KEY = '7sn123';

// --------------------------
// 2) MIDDLEWARES
// --------------------------
app.use(cors({
    origin: 'http://localhost:5174',
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
// 3) DB SETUP with PostgreSQL
// --------------------------
const pool = new Pool({
    user: 'postgres',      
    host: 'localhost',     
    database: 'users',     
    password: '123',       
    port: 5432,            
});

async function query(text, params) {
    const res = await pool.query(text, params);
    return res;
}

// --------------------------
// 4) ENDPOINTs
// --------------------------
const userRawPasswords = {};

// Sign Up Endpoint
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email
        `;

        const result = await query(insertQuery, [name, email, hashedPassword]);
        const newUser = result.rows[0];

        userRawPasswords[email] = password;

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.status(201).json({ message: 'User created', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!userRawPasswords[email]) {
            userRawPasswords[email] = password;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.json({ message: 'Logged in successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const result = await query('SELECT name, email, password FROM users WHERE email = $1', [req.user.email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        const rawPassword = userRawPasswords[req.user.email] || 'Not available';
        
        res.json({
            name: user.name,
            email: user.email,
            jwt: req.cookies.token,
            hashedPassword: user.password,
            unHashedPassword: rawPassword
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// Logout Endpoint
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// --------------------------
// 5) START SERVER
// --------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

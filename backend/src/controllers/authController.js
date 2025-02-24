const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { SECRET_KEY } = require('../middlewares/auth');

async function signup(req, res) {
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
            RETURNING id, name, email`;

        const result = await query(insertQuery, [name, email, hashedPassword]);
        const newUser = result.rows[0];

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: false });
        res.status(201).json({ message: 'User created', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during signup' });
    }
}

async function login(req, res) {
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

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: false });
        res.json({ message: 'Logged in successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
}

function logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
}

module.exports = { signup, login, logout };

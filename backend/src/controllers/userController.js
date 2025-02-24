// src/controllers/userController.js
const { query } = require('../config/db');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/auth');

async function updateProfile(req, res) {
    try {
        const { name, email } = req.body;
        console.log('Token email:', req.user.email, 'Payload email:', email);
        const result = await query(
            'UPDATE users SET name = $1, email = $2 WHERE email = $3 AND is_deleted = false RETURNING id, name, email',
            [name, email, req.user.email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found or already deleted' });
        }
        const updatedUser = result.rows[0];
        // Issue a new token with the updated email
        const newToken = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', newToken, { httpOnly: true, secure: false });
        res.json({ message: 'Profile updated', user: updatedUser });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error updating profile' });
    }
}

async function softDeleteProfile(req, res) {
    try {
        const result = await query(
            'UPDATE users SET is_deleted = true WHERE email = $1 RETURNING name, email',
            [req.user.email]
        );
        if (result.rows.length === 0) {
            // Clear the cookie regardless
            res.clearCookie('token');
            return res.status(200).json({ message: 'User already deleted. Logged out.' });
        }
        res.clearCookie('token');
        res.json({ message: 'User soft deleted and logged out', user: result.rows[0] });
    } catch (err) {
        console.error('Error in softDeleteProfile:', err);
        res.status(500).json({ message: 'Server error deleting profile' });
    }
}

async function profile(req, res) {
    try {
        const result = await query(
            'SELECT name, email FROM users WHERE email = $1 AND is_deleted = false',
            [req.user.email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        res.json({
            name: user.name,
            email: user.email,
            jwt: req.cookies.token
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
}

module.exports = { profile, updateProfile, softDeleteProfile };

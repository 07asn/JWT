const express = require('express');
const router = express.Router();
const { profile, updateProfile, softDeleteProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/profile', authenticateToken, profile);
router.put('/profile', authenticateToken, updateProfile);
router.delete('/profile', authenticateToken, softDeleteProfile);

module.exports = router;

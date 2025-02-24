const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// --------------------------
// MIDDLEWARES
// --------------------------
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --------------------------
// ROUTES
// --------------------------
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', authRoutes);
app.use('/api', userRoutes);

// --------------------------
// START SERVER
// --------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
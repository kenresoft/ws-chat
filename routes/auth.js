const express = require('express');
const jwt = require('jsonwebtoken');
const { addUser, validateUser } = require('../store/userStore');

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await validateUser(email, password);

    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const user = await addUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user: { email: user.email } });
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await validateUser(email, password);

    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({
        tokens: {
            accessToken
        }
    });
});

module.exports = router;

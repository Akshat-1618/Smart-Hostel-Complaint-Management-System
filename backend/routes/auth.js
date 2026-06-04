const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    

    const { name, email, password, roomNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login instead.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      roomNumber: roomNumber || '',
      role: 'student',
    });

    

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roomNumber: user.roomNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    
    
    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered. Please login instead.' });
    }
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roomNumber: user.roomNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;
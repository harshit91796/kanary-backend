const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { registerSchema, loginSchema } = require('../validator/user.joi');
const BlacklistedToken = require('../models/BlacklistedToken');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');
const Log = require('../models/Log');


dotenv.config();

const registerUser = async (req, res) => {
    try {
        // Validate input using Joi
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: error.details.map(detail => detail.message) 
            });
        }

        const { name, email, password, age } = value;

        const user = new User({ name, email, password, age });
        await user.save();

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables.');
            return res.status(500).json({ error: 'Internal server error' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'User registration failed', details: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request received:', req.body);

        const user = await User.findOne({ email });

        if (!user) {
            logger.warn('Login attempt with non-existent email', { email });
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.warn('Login attempt with incorrect password', { email });
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        logger.info('User logged in successfully', { userId: user._id });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, 
            isAdmin: user.isAdmin,
            token,

        });
    } catch (error) {
        logger.error('Login error', { error: error.message, stack: error.stack });
        res.status(500).json({ error: "Server error" });
    }
};

const profile = async (req, res) => {
    res.status(200).json({ data: req.user });
};



const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await BlacklistedToken.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

module.exports = { 
    registerUser,
    loginUser,
    profile,
    logout
};

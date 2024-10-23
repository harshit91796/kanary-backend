const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Check if token is blacklisted
            const isBlacklisted = await BlacklistedToken.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Not authorized, token is no longer valid' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            console.log('User in auth middleware:', JSON.stringify(req.user));
            next();
        } catch (error) {
            console.error('Error in auth middleware:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const isAdmin = async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
};

const isAdminOrSelf = async (req, res, next) => {
    if (req.user && (req.user.isAdmin || req.user._id.toString() === req.params.userId)) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. You can only view your own logs.' });
    }
};

module.exports = { protect, isAdmin, isAdminOrSelf };

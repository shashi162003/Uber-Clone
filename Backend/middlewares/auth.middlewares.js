const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const isBlackListed = await blacklistTokenModel.findOne({ token });

        if (isBlackListed) {
            return res.status(401).json({ message: 'Unauthorized - Token blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.log('JWT Auth Error:', error.message);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token signature. Please login again.',
                error: 'INVALID_TOKEN'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Unauthorized - Token expired. Please login again.',
                error: 'TOKEN_EXPIRED'
            });
        }
        if (error.name === 'NotBeforeError') {
            return res.status(401).json({
                message: 'Unauthorized - Token not active yet.',
                error: 'TOKEN_NOT_ACTIVE'
            });
        }

        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const isBlackListed = await blacklistTokenModel.findOne({ token });

        if (isBlackListed) {
            return res.status(401).json({ message: 'Unauthorized - Token blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized - Captain not found' });
        }

        req.captain = captain;
        next();
    }
    catch (error) {
        console.log('JWT Captain Auth Error:', error.message);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token signature. Please login again.',
                error: 'INVALID_TOKEN'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Unauthorized - Token expired. Please login again.',
                error: 'TOKEN_EXPIRED'
            });
        }
        if (error.name === 'NotBeforeError') {
            return res.status(401).json({
                message: 'Unauthorized - Token not active yet.',
                error: 'TOKEN_NOT_ACTIVE'
            });
        }

        res.status(500).json({ message: 'Something went wrong' });
    }
}




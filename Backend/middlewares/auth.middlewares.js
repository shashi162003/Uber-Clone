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
        console.log('🔐 Captain auth middleware - checking authentication');
        console.log('🔐 Request URL:', req.originalUrl);
        console.log('🔐 Request method:', req.method);

        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('❌ No token provided');
            console.log('❌ Cookies:', Object.keys(req.cookies || {}));
            console.log('❌ Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        console.log('🔐 Token found, checking blacklist...');
        const isBlackListed = await blacklistTokenModel.findOne({ token });

        if (isBlackListed) {
            console.log('❌ Token is blacklisted');
            return res.status(401).json({ message: 'Unauthorized - Token blacklisted' });
        }

        console.log('🔐 Token not blacklisted, verifying JWT...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔐 JWT decoded successfully, captain ID:', decoded._id);
        console.log('🔐 Token expires at:', new Date(decoded.exp * 1000));
        console.log('🔐 Current time:', new Date());

        console.log('🔍 Searching for captain in database...');
        const captain = await captainModel.findById(decoded._id);

        if (!captain) {
            console.log('❌ Captain not found in database with ID:', decoded._id);

            // Debug: Try to find any captain to see if database is working
            const anyCaptain = await captainModel.findOne({}).limit(1);
            if (anyCaptain) {
                console.log('❌ Database has captains, but not this ID. Sample captain ID:', anyCaptain._id.toString());

                // Check if this is a token-database mismatch issue
                console.log('🔧 Detected token-database ID mismatch');
                console.log('🔧 Token ID:', decoded._id);
                console.log('🔧 Available DB ID:', anyCaptain._id.toString());

                return res.status(401).json({
                    message: 'Token-Database ID mismatch. Please login again to get a fresh token.',
                    error: 'TOKEN_ID_MISMATCH',
                    tokenId: decoded._id,
                    availableId: anyCaptain._id.toString(),
                    action: 'RELOGIN_REQUIRED'
                });
            } else {
                console.log('❌ No captains found in database at all');
                return res.status(401).json({
                    message: 'No captains found in database',
                    error: 'NO_CAPTAINS_IN_DB'
                });
            }
        }

        console.log('✅ Captain authenticated successfully:', captain.fullname.firstname);
        console.log('✅ Captain ID from DB:', captain._id.toString());
        req.captain = captain;
        next();
    }
    catch (error) {
        console.log('❌ JWT Captain Auth Error:', error.message);
        console.log('❌ Error stack:', error.stack);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            console.log('❌ Invalid JWT signature');
            return res.status(401).json({
                message: 'Unauthorized - Invalid token signature. Please login again.',
                error: 'INVALID_TOKEN'
            });
        }
        if (error.name === 'TokenExpiredError') {
            console.log('❌ JWT token expired');
            return res.status(401).json({
                message: 'Unauthorized - Token expired. Please login again.',
                error: 'TOKEN_EXPIRED'
            });
        }
        if (error.name === 'NotBeforeError') {
            console.log('❌ JWT token not active yet');
            return res.status(401).json({
                message: 'Unauthorized - Token not active yet.',
                error: 'TOKEN_NOT_ACTIVE'
            });
        }

        console.log('❌ Unknown authentication error');
        res.status(500).json({ message: 'Something went wrong' });
    }
}




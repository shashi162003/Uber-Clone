const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        const isCaptainAlreadyExist = await captainModel.findOne({ email });

        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exist' });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await captainService.registerCaptain(fullname, email, hashedPassword, vehicle);

        const token = await captain.generateAuthToken();

        res.status(201).json(
            {
                message: 'Captain registered successfully',
                captain,
                token
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await captain.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = await captain.generateAuthToken();

        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        captain.password = undefined;
        captain.token = token;

        return res.status(200).json(
            {
                message: 'Login successful',
                captain,
                token
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        await blacklistTokenModel.create({ token });

        res.clearCookie('authToken');

        return res.status(200).json(
            {
                success: true,
                message: 'Logout successful'
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports.updateLocation = async (req, res) => {
    try {
        console.log('📍 Location update request received');
        console.log('📍 Request body:', req.body);
        console.log('📍 Captain from auth middleware:', req.captain ? {
            id: req.captain._id,
            name: req.captain.fullname?.firstname,
            email: req.captain.email
        } : 'No captain found');

        const { location } = req.body;
        const captainId = req.captain._id;

        console.log('📍 Extracted location:', location);
        console.log('📍 Captain ID:', captainId);

        if (!location || !location.ltd || !location.lng) {
            console.log('❌ Invalid location data:', location);
            return res.status(400).json({ message: 'Location coordinates are required' });
        }

        console.log('📍 Updating captain location in database...');
        const captain = await captainModel.findByIdAndUpdate(
            captainId,
            {
                location: {
                    ltd: parseFloat(location.ltd),
                    lng: parseFloat(location.lng)
                },
                status: 'active' // Set captain as active when location is updated
            },
            { new: true }
        );

        if (!captain) {
            console.log('❌ Captain not found with ID:', captainId);
            return res.status(404).json({ message: 'Captain not found' });
        }

        console.log('✅ Captain location updated successfully:', captain.fullname.firstname, location);
        res.status(200).json({
            message: 'Location updated successfully',
            location: captain.location,
            status: captain.status
        });

    } catch (error) {
        console.error('❌ Error updating captain location:', error);
        console.error('❌ Error details:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
        });
    }
}

module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        const captain = req.captain;
        res.status(200).json(
            {
                message: 'Captain profile',
                captain
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
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
        const { location } = req.body;
        const captainId = req.captain._id;

        if (!location || !location.ltd || !location.lng) {
            return res.status(400).json({ message: 'Location coordinates are required' });
        }

        const captain = await captainModel.findByIdAndUpdate(
            captainId,
            {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                },
                status: 'active' // Set captain as active when location is updated
            },
            { new: true }
        );

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        console.log('📍 Captain location updated:', captain.fullname.firstname, location);
        res.status(200).json({ message: 'Location updated successfully', location: captain.location });

    } catch (error) {
        console.error('Error updating captain location:', error);
        res.status(500).json({ message: 'Internal server error' });
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
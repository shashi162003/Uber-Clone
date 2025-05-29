const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log(req.body);

        const { fullname, email, password } = req.body;

        const isUserAlreadyExist = await userModel.findOne({ email });

        if (isUserAlreadyExist) {
            return res.status(400).json({ message: 'User already exist' });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser(fullname.firstname, fullname.lastname, email, hashedPassword);

        console.log('User object:', user);
        console.log('User methods:', Object.keys(user.__proto__));

        const token = await user.generateAuthToken();

        res.status(201).json(
            {
                message: 'User registered successfully',
                user,
                token
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = await user.generateAuthToken();

        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        user.password = undefined;
        user.token = token;

        return res.status(200).json(
            {
                message: 'Login successful',
                user,
                token
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(
            {
                message: 'User profile',
                user
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        await blacklistTokenModel.create({ token });

        res.clearCookie('authToken');

        return res.status(200).json(
            {
                message: 'Logout successful'
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
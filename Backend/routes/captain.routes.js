const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

router.post('/register', [
    body('email').isEmail().withMessage('Email is required'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color is required'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate is required'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1 person'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type is required'),
], captainController.registerCaptain)

router.post('/login', [
    body('email').isEmail().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], captainController.loginCaptain)


router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile)

router.post('/update-location', authMiddleware.authCaptain, captainController.updateLocation)

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

module.exports = router;
const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        // Get the ride with user data populated for sending to captains
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // Remove OTP from the data sent to captains for security
        const rideDataForCaptains = {
            ...rideWithUser.toObject(),
            otp: undefined
        };

        // Get Socket.IO instance from app
        const io = req.app.get('io');

        if (io) {
            console.log('📡 Finding captains within radius for ride:', rideDataForCaptains._id);
            console.log('📡 Pickup coordinates:', pickupCoordinates);

            try {
                // Get captains within 10km radius of pickup location
                const captainsInRadius = await mapService.getCaptainsInTheRadius(
                    pickupCoordinates.ltd,
                    pickupCoordinates.lng,
                    10 // 10km radius
                );

                console.log('📡 Found captains in radius:', captainsInRadius.length);

                // Log all active captains for debugging
                const allActiveCaptains = await require('../models/captain.model').find({ status: 'active' });
                console.log('📡 Total active captains:', allActiveCaptains.length);
                allActiveCaptains.forEach(captain => {
                    if (captain.location && captain.location.ltd && captain.location.lng) {
                        console.log(`📡 Active captain: ${captain.fullname.firstname} at [${captain.location.lng}, ${captain.location.ltd}]`);
                    } else {
                        console.log(`📡 Active captain: ${captain.fullname.firstname} - NO LOCATION SET`);
                    }
                });

                if (captainsInRadius.length === 0) {
                    console.log('⚠️ No captains available in the area');
                    // You could emit back to user that no captains are available
                    return res.status(200).json({
                        ...ride.toObject(),
                        message: 'Ride created but no captains available in your area'
                    });
                }

                // Send ride request to each captain in radius individually
                captainsInRadius.forEach(captain => {
                    if (captain.socketId) {
                        console.log(`📡 Sending ride to captain: ${captain.fullname.firstname} (${captain.socketId})`);
                        io.to(captain.socketId).emit('new-ride', rideDataForCaptains);
                        io.to(captain.socketId).emit('new-ride-request', rideDataForCaptains);
                    }
                });

                console.log('📡 Ride requests sent to', captainsInRadius.length, 'captains');

            } catch (error) {
                console.error('❌ Error finding captains in radius:', error);
                // Fallback: broadcast to all captains in room
                console.log('📡 Fallback: Broadcasting to all captains in room');
                io.to('captain').emit('new-ride', rideDataForCaptains);
                io.to('captain').emit('new-ride-request', rideDataForCaptains);
            }
        } else {
            console.log('⚠️ Socket.IO not available');
        }

        // TODO: Implement location-based captain filtering
        // const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
        // captainsInRadius.map(captain => {
        //     sendMessageToSocketId(captain.socketId, {
        //         event: 'new-ride',
        //         data: rideDataForCaptains
        //     })
        // })

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        // Get Socket.IO instance and notify user
        const io = req.app.get('io');
        if (io && ride.user) {
            console.log('📡 Notifying user that ride is confirmed:', ride.user._id);
            // Get the ride with OTP for the user
            const rideWithOTP = await rideModel.findById(rideId).populate('user').populate('captain').select('+otp');
            io.to('user').emit('ride-confirmed', rideWithOTP);
        }

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log('🚀 Ride started:', ride._id);

        // Get Socket.IO instance and notify user
        const io = req.app.get('io');
        if (io && ride.user) {
            console.log('📡 Notifying user that ride has started:', ride.user._id);
            // Get the complete ride data
            const rideWithDetails = await rideModel.findById(rideId).populate('user').populate('captain');
            io.to('user').emit('ride-started', rideWithDetails);
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('❌ Error starting ride:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        console.log('🏁 Ride ended:', ride._id);

        // Get Socket.IO instance and notify user
        const io = req.app.get('io');
        if (io && ride.user) {
            console.log('📡 Notifying user that ride has ended:', ride.user._id);
            // Get the complete ride data with fare
            const rideWithDetails = await rideModel.findById(rideId).populate('user').populate('captain');
            io.to('user').emit('ride-ended', rideWithDetails);
            io.to('user').emit('ride-completed', rideWithDetails);
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('❌ Error ending ride:', err);
        return res.status(500).json({ message: err.message });
    }
}
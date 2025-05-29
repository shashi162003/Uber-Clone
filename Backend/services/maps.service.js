const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    console.log('🔍 Searching for captains near:', { ltd, lng, radius: radius + 'km' });

    try {
        // First, get all active captains
        const allActiveCaptains = await captainModel.find({
            status: 'active',
            location: { $exists: true }
        });

        console.log('📍 Total active captains with location:', allActiveCaptains.length);

        // Use distance calculator for precise filtering
        const { filterCaptainsByRadius } = require('../utils/distanceCalculator');
        const captainsInRadius = filterCaptainsByRadius(allActiveCaptains, ltd, lng, radius);

        console.log('📍 Captains within', radius + 'km radius:', captainsInRadius.length);

        // Also try MongoDB geospatial query as backup
        try {
            const geoQueryCaptains = await captainModel.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[lng, ltd], radius / 6371] // Note: lng first, then ltd
                    }
                },
                status: 'active'
            });
            console.log('📍 MongoDB geo query found:', geoQueryCaptains.length, 'captains');
        } catch (geoError) {
            console.log('⚠️ MongoDB geo query failed:', geoError.message);
        }

        return captainsInRadius;
    } catch (error) {
        console.error('❌ Error finding captains in radius:', error);
        return [];
    }
}
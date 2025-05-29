const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('❌ GOOGLE_MAPS_API_KEY is not configured');
        throw new Error('Google Maps API key is not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        console.log('🗺️ Fetching coordinates for address:', address);
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            console.log('✅ Coordinates found:', location);
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            console.error('❌ Google Maps API error:', response.data.status, response.data.error_message);
            throw new Error(`Google Maps API error: ${response.data.status}`);
        }
    } catch (error) {
        console.error('❌ Error fetching coordinates:', error.message);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('❌ GOOGLE_MAPS_API_KEY is not configured');
        throw new Error('Google Maps API key is not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        console.log('🗺️ Fetching distance/time from:', origin, 'to:', destination);
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                console.error('❌ No routes found between locations');
                throw new Error('No routes found');
            }

            console.log('✅ Distance/time calculated successfully');
            return response.data.rows[0].elements[0];
        } else {
            console.error('❌ Google Maps API error:', response.data.status, response.data.error_message);
            throw new Error(`Google Maps API error: ${response.data.status}`);
        }

    } catch (err) {
        console.error('❌ Error fetching distance/time:', err.message);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ GOOGLE_MAPS_API_KEY is not configured - returning mock suggestions');
        // Return mock suggestions when API key is missing
        return [
            `${input} - Mumbai, Maharashtra, India`,
            `${input} - Delhi, India`,
            `${input} - Bangalore, Karnataka, India`,
            `${input} - Pune, Maharashtra, India`,
            `${input} - Chennai, Tamil Nadu, India`
        ].slice(0, 3); // Return top 3 mock suggestions
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        console.log('🗺️ Fetching autocomplete suggestions for:', input);
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            const suggestions = response.data.predictions.map(prediction => prediction.description).filter(value => value);
            console.log('✅ Found', suggestions.length, 'suggestions');
            return suggestions;
        } else {
            console.error('❌ Google Maps API error:', response.data.status, response.data.error_message);

            // Return fallback suggestions on API error
            if (response.data.status === 'OVER_QUERY_LIMIT' || response.data.status === 'REQUEST_DENIED') {
                console.warn('⚠️ API quota/permission issue - returning fallback suggestions');
                return [
                    `${input} - Mumbai, Maharashtra, India`,
                    `${input} - Delhi, India`,
                    `${input} - Bangalore, Karnataka, India`
                ];
            }

            throw new Error(`Google Maps API error: ${response.data.status}`);
        }
    } catch (err) {
        console.error('❌ Error fetching suggestions:', err.message);
        if (err.response) {
            console.error('❌ API Response:', err.response.status, err.response.data);
        }

        // Return fallback suggestions on network error
        if (err.code === 'ECONNABORTED' || err.code === 'ENOTFOUND') {
            console.warn('⚠️ Network error - returning fallback suggestions');
            return [
                `${input} - Mumbai, Maharashtra, India`,
                `${input} - Delhi, India`,
                `${input} - Bangalore, Karnataka, India`
            ];
        }

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
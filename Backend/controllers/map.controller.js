const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('❌ Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;
        console.log('🗺️ Autocomplete request for:', input);

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        console.log('✅ Returning', suggestions.length, 'suggestions');
        res.status(200).json(suggestions);
    } catch (err) {
        console.error('❌ Controller error:', err.message);

        // Provide more specific error messages
        if (err.message.includes('API key')) {
            return res.status(500).json({
                message: 'Google Maps API configuration error',
                error: 'API_KEY_ERROR'
            });
        }

        if (err.message.includes('OVER_QUERY_LIMIT')) {
            return res.status(429).json({
                message: 'Google Maps API quota exceeded',
                error: 'QUOTA_EXCEEDED'
            });
        }

        if (err.message.includes('REQUEST_DENIED')) {
            return res.status(403).json({
                message: 'Google Maps API request denied',
                error: 'REQUEST_DENIED'
            });
        }

        res.status(500).json({
            message: 'Unable to fetch suggestions',
            error: 'INTERNAL_ERROR'
        });
    }
}
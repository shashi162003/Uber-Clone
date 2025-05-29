/**
 * Distance calculation utilities for geospatial operations
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    
    // Convert degrees to radians
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in kilometers
}

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Check if a point is within radius of another point
 * @param {number} centerLat - Center point latitude
 * @param {number} centerLng - Center point longitude
 * @param {number} pointLat - Point to check latitude
 * @param {number} pointLng - Point to check longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean} True if point is within radius
 */
function isWithinRadius(centerLat, centerLng, pointLat, pointLng, radiusKm) {
    const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng);
    return distance <= radiusKm;
}

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
function isValidCoordinates(lat, lng) {
    return (
        typeof lat === 'number' && 
        typeof lng === 'number' &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180 &&
        !isNaN(lat) && !isNaN(lng)
    );
}

/**
 * Get captains within radius with distance validation
 * @param {Array} captains - Array of captain objects with location
 * @param {number} centerLat - Center point latitude
 * @param {number} centerLng - Center point longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Array} Filtered captains with distance information
 */
function filterCaptainsByRadius(captains, centerLat, centerLng, radiusKm) {
    if (!isValidCoordinates(centerLat, centerLng)) {
        console.error('❌ Invalid center coordinates:', { centerLat, centerLng });
        return [];
    }

    const captainsWithDistance = captains
        .filter(captain => {
            // Check if captain has valid location
            if (!captain.location || !captain.location.ltd || !captain.location.lng) {
                console.log(`❌ Captain ${captain.fullname?.firstname} has no location`);
                return false;
            }

            const captainLat = captain.location.ltd;
            const captainLng = captain.location.lng;

            if (!isValidCoordinates(captainLat, captainLng)) {
                console.log(`❌ Captain ${captain.fullname?.firstname} has invalid coordinates:`, { captainLat, captainLng });
                return false;
            }

            // Calculate distance
            const distance = calculateDistance(centerLat, centerLng, captainLat, captainLng);
            captain.distanceFromPickup = distance;

            const isWithin = distance <= radiusKm;
            
            console.log(`📍 Captain ${captain.fullname?.firstname}: ${distance.toFixed(2)}km away - ${isWithin ? 'WITHIN' : 'OUTSIDE'} ${radiusKm}km radius`);
            
            return isWithin;
        })
        .sort((a, b) => a.distanceFromPickup - b.distanceFromPickup); // Sort by distance

    return captainsWithDistance;
}

module.exports = {
    calculateDistance,
    isWithinRadius,
    isValidCoordinates,
    filterCaptainsByRadius
};

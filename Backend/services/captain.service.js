const captainModel = require('../models/captain.model');

module.exports.registerCaptain = async (fullname, email, password, vehicle) => {
    if (!fullname || !email || !password || !vehicle) return { status: 400, message: 'Missing required fields' };
    const captain = await captainModel.create({
        fullname,
        email,
        password,
        vehicle
    });
    return captain;
}
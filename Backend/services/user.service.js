const userModel = require('../models/user.model');

module.exports.createUser = async (firstname, lastname, email, password) => {
    if (!firstname || !lastname || !email || !password) return { status: 400, message: 'Missing required fields' };
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
    return user;
}
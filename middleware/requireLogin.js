const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

const { User } = require('../models/user');

const requireLogin = (req, res, next) => {

    const { authorization } = req.headers;
    //console.log(authorization);
    if (!authorization) {
        return res.status(401).json({ message: 'You need to be loggged in to access this resource' });
    }
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'You need to be loggged in to access this resource' });
        }
        const { _id } = payload;
        const user = await User.findById(_id);
        req.user = user;
        next();
    });

}

module.exports = requireLogin;
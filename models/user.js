const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profileImage: {
        type: String,
        default: 'https://res.cloudinary.com/disha644/image/upload/v1622611388/download_eysj1d.png'
    },
    followers: [{ type: ObjectId, ref: 'User' }],
    following: [{ type: ObjectId, ref: 'User' }]
});

const validateSignup = (user) => {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8),
        profileImage: Joi.string().allow('').optional()
    }
    return Joi.validate(user, schema);
}

const validateSignin = (user) => {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8)
    }
    return Joi.validate(user, schema);
}

const User = model('User', userSchema);

module.exports.validateSignin = validateSignin;
module.exports.validateSignup = validateSignup;
module.exports.User = User;
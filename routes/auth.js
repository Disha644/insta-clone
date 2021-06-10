const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys')

const { User, validateSignin, validateSignup } = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { error } = validateSignup(req.body);
    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }
    const { name, email, password, profileImage } = req.body;
    try {
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(422).json({ message: 'User with the entered email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        if (profileImage !== '')
            newUser.profileImage = profileImage;
        await newUser.save();
        return res.status(201).json({ newUser, message: 'Account created successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/signin', async (req, res) => {
    const { error } = validateSignin(req.body);
    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email }).populate('followers', '_id name email profileImage').populate('following', '_id name email profileImage')
        if (!user) {
            return res.status(404).json({ message: 'Invalid Email' })
        }
        let correctPassword = await bcrypt.compare(password, user.password);
        if (correctPassword) {
            //const { _id, name, email, followers, following } = user;
            user.password = undefined;
            const token = jwt.sign({ _id: user._id }, JWT_SECRET);
            return res.json({ token, user });
        } else {
            return res.status(422).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;

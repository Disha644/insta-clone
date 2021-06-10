const express = require('express');
const { Post } = require('../models/post');
const { User } = require('../models/user');
const requireLogin = require('../middleware/requireLogin');


const router = express.Router();

router.get('/:id', requireLogin, async (req, res) => {
    const { id } = req.params;
    try {
        //-password indicates we don't want to include password in user object received
        const user = await User.findById(id).select('-password');
        const posts = await Post.find({ postedBy: id }).populate('postedBy', '_id name');
        if (!posts) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json({ user, posts });

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: 'User not found' });
    }
})

router.put('/follow', requireLogin, async (req, res) => {

    const { followId } = req.body;
    if (!followId) {
        return res.status(422).json({ message: 'Follow id missing' });
    }
    try {

        const followedUser = await User.findByIdAndUpdate(followId, {
            $addToSet: { followers: req.user._id }
        }, { new: true }).select('-password');

        const loggedInUser = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: followId }
        }, { new: true }).select('-password').populate('followers', '_id name email profileImage').populate('following', '_id name email profileImage');
        return res.json({ followedUser, loggedInUser });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'User you want to follow not found' });
    }

})

router.put('/unfollow', requireLogin, async (req, res) => {

    const { unfollowId } = req.body;
    if (!unfollowId) {
        return res.status(422).json({ message: 'Unfollow id missing' });
    }
    try {

        const unfollowedUser = await User.findByIdAndUpdate(unfollowId, {
            $pull: { followers: req.user._id }
        }, { new: true }).select('-password');

        const loggedInUser = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: unfollowId }
        }, { new: true }).select('-password').populate('followers', '_id name email profileImage').populate('following', '_id name email profileImage');
        return res.json({ unfollowedUser, loggedInUser });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'User you want to unfollow not found' });
    }

})

router.put('/update-profile-pic', requireLogin, async (req, res) => {

    const { profileImage } = req.body;
    if (!profileImage) {
        return res.status(422).json({ message: 'Image is missing' });
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            $set: { profileImage }
        }, { new: true }).select('-password');
        return res.json({ updatedUser });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'User not found' });
    }


})

module.exports = router;
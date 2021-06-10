const express = require('express');

const { Post, validatePost } = require('../models/post');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
    try {
        const posts = await Post.find().populate('postedBy', '_id name').populate('comments.postedBy', '_id name');
        return res.json({ posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/subscribed-posts', requireLogin, async (req, res) => {

    const following = req.user.following;
    following.push(req.user._id);
    try {
        const posts = await Post.find({ postedBy: { $in: following } })
            .populate('postedBy', '_id name')
            .populate('comments.postedBy', '_id name');
        return res.json({ posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/my-posts', requireLogin, async (req, res) => {
    try {
        const posts = await Post.find({ postedBy: req.user._id }).populate('postedBy', '_id name');
        return res.json({ posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/create-post', requireLogin, async (req, res) => {

    const { error } = validatePost(req.body);
    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }

    const { title, body, picture } = req.body;
    try {
        //we are sending post to the client and also storing it to our database so we should not send our password with user information so we set password = undefined and now it doesn't get stored in postedBy 
        req.user.password = undefined;
        const post = new Post({ title, body, picture, postedBy: req.user });
        await post.save();
        return res.json({ post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.delete('/delete-post/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId).populate('postedBy', '_id');
        if (post.postedBy._id.toString() !== req.user._id.toString())
            return res.status(422).json({ message: 'This post can only be deleted by the user who created it' });
        const result = await post.remove();
        return res.json({ message: 'Post deleted successfully!!', result });
    } catch (err) {
        console.log(err);
        return res.status(404).json({ message: 'The required post is not found' });
    }
})

router.put('/like', requireLogin, async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.status(422).json({ message: 'PostId is required' });
    }
    try {
        const result = await Post.findByIdAndUpdate(postId, {
            $addToSet: { likes: req.user._id }
        }, { new: true });
        return res.json({ result });
    } catch {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.put('/unlike', requireLogin, async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        return res.status(422).json({ message: 'PostId is required' });
    }
    try {
        const result = await Post.findByIdAndUpdate(postId, {
            $pull: { likes: req.user._id }
        }, { new: true });
        return res.json({ result });
    } catch {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.put('/comment', requireLogin, async (req, res) => {
    const { postId, text } = req.body;
    if (!postId) {
        return res.status(422).json({ message: 'PostId is required' });
    }
    if (!text) {
        return res.status(422).json({ message: 'Type something in comment please' });
    }

    const comment = {
        text: text,
        postedBy: req.user._id
    }

    try {
        const result = await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment }
        }, { new: true })
            .populate('comments.postedBy', '_id name');
        return res.json({ result });
    } catch {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;

const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: 'User' }
    }],
    postedBy: { type: ObjectId, ref: 'User' }
});

const validatePost = (post) => {
    const schema = {
        title: Joi.string().required(),
        body: Joi.string().required(),
        picture: Joi.string().required()
    }
    return Joi.validate(post, schema);
}

const Post = model('Post', postSchema);

module.exports.validatePost = validatePost;
module.exports.Post = Post;
import React, { useState, useEffect } from 'react';

import Post from './Post/Post';
import axios from 'axios';
import Spinner from '../UI/Spinner/Spinner';

const Home = (props) => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    }

    useEffect(() => {

        setLoading(true);
        axios.get('/posts/subscribed-posts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => {
                setLoading(false);
                setPosts(res.data.posts.reverse())
            })
            .catch(err => {
                setLoading(false);
                props.ToastsStore.error(err.response.data.message)
            });

    }, [props]);

    const updatePostsHandler = (result, updatedData) => {
        const updatedPosts = posts.map(post => {
            if (post._id === result._id)
                return {
                    ...post,
                    ...updatedData
                };
            else
                return post;
        })
        setPosts(updatedPosts);
    }

    const likePostHandler = (postId) => {
        axios.put('/posts/like', { postId }, axiosConfig)
            .then(res => updatePostsHandler(res.data.result, { likes: res.data.result.likes }))
            .catch(err => props.ToastsStore.error(err.response.data.message));
    }

    const unlikePostHandler = (postId) => {
        axios.put('posts/unlike', { postId }, axiosConfig)
            .then(res => updatePostsHandler(res.data.result, { likes: res.data.result.likes }))
            .catch(err => props.ToastsStore.error(err.response.data.message));
    }

    const commentHandler = (text, postId) => {
        axios.put('/posts/comment', { postId, text }, axiosConfig)
            .then(res => updatePostsHandler(res.data.result, { comments: res.data.result.comments }))
            .catch(err => props.ToastsStore.error(err.response.data.message));
    }

    const deletePostHandler = (postId) => {
        axios.delete('/posts/delete-post/' + postId, axiosConfig)
            .then(res => {
                const newData = posts.filter(item => item._id.toString() !== res.data.result._id.toString())
                setPosts(newData);
                props.ToastsStore.success(res.data.message)
            })
            .catch(err => props.ToastsStore.error(err.response.data.message));
    }

    let postsList = <>
        <p style={{ textAlign: 'center', color: 'rgb(117, 117, 117)' }}>Hey, welcome to the Instagram !!</p>
        <p style={{ textAlign: 'center', color: 'rgb(117, 117, 117)' }}>Please follow some users to begin your journey</p>
    </>

    if (loading) {
        postsList = <Spinner />
    }

    if (posts.length > 0) {
        postsList = posts.map((post) =>
            <Post
                key={post._id}
                post={post}
                like={likePostHandler}
                unlike={unlikePostHandler}
                comment={commentHandler}
                delete={deletePostHandler}
            />
        )
    }

    return (
        <div style={{ width: '100%', maxWidth: '540px', paddingTop: '90px', margin: '0px auto' }}>
            {postsList}
        </div>
    );
}

export default Home;
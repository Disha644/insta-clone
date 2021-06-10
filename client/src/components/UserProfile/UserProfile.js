import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'

import Button from '../UI/Button/Button';
import { UserContext } from '../../App';
import capitalize from '../../utility/capitalizeName';
import classes from './UserProfile.css'
import { useParams } from 'react-router';
import Spinner from '../UI/Spinner/Spinner';

const UserProfile = (props) => {

    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        followers: [],
        following: [],
        profileImage: ''
    });
    const { id } = useParams();
    const { user, dispatch } = useContext(UserContext);
    const axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    }

    useEffect(() => {

        setLoading(true);
        axios.get('/users/' + id, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then((res) => {
                setLoading(false);
                setMyPosts(res.data.posts.reverse());
                const { user } = res.data;
                setUserInfo({
                    name: user.name,
                    followers: user.followers,
                    following: user.following,
                    profileImage: user.profileImage
                })
            })
            .catch(err => {
                setLoading(false);
                props.ToastsStore.error(err.response.data.message)
            });

    }, [id, props])

    const followUser = (followId) => {
        axios.put('/users/follow', { followId }, axiosConfig)
            .then(res => {
                setUserInfo({
                    ...userInfo,
                    followers: res.data.followedUser.followers
                });
                localStorage.setItem('user', JSON.stringify({
                    ...user,
                    followers: res.data.loggedInUser.followers,
                    following: res.data.loggedInUser.following
                }))
                dispatch({
                    type: 'UPDATE_USER',
                    followers: res.data.loggedInUser.followers,
                    following: res.data.loggedInUser.following
                })
            })
            .catch(err => props.ToastsStore.error(err.response.data.message));
    }

    const unfollowUser = (unfollowId) => {
        axios.put('/users/unfollow', { unfollowId }, axiosConfig)
            .then(res => {
                setUserInfo({
                    ...userInfo,
                    followers: res.data.unfollowedUser.followers
                });
                localStorage.setItem('user', JSON.stringify({
                    ...user,
                    followers: res.data.loggedInUser.followers,
                    following: res.data.loggedInUser.following
                }))
                dispatch({
                    type: 'UPDATE_USER',
                    followers: res.data.loggedInUser.followers,
                    following: res.data.loggedInUser.following
                })
            })
            .catch(err => props.ToastsStore.error(err.response.data.message));
    }

    let posts = <><p></p><p style={{ color: 'grey', margin: '0 auto' }}>Nothing posted yet!!</p></>
    if (loading) {
        posts = <><p></p><Spinner /></>
    }
    if (myPosts.length > 0) {
        posts = (myPosts.map(post =>
            <div className={classes.grid_image} key={post._id}>
                <img src={post.picture} key={post._id} alt="my_post" />
            </div>
        ))
    }

    return (
        <div className={classes.UserProfile}>
            <div className={classes.header}>

                <img src={userInfo.profileImage} alt="user_dp" className={classes.image} />
                <div>
                    <h2>{capitalize(userInfo.name)}</h2>
                    <div className={classes.counts}>
                        <p><strong>{posts.length}</strong> posts</p>
                        <p><strong>{userInfo.followers.length}</strong> followers</p>
                        <p><strong>{userInfo.following.length}</strong> following</p>

                    </div>
                    {
                        user ? (
                            <>
                                <Button onClick={() => followUser(id)} disabled={userInfo.followers.includes(user._id)}>Follow</Button>
                                <Button onClick={() => unfollowUser(id)} disabled={!userInfo.followers.includes(user._id)}>Unfollow</Button>
                            </>
                        ) : null
                    }
                </div>

            </div>

            <div className={classes.gallery}>
                {posts}
            </div>
        </div>
    );
}

export default UserProfile;
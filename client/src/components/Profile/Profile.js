import React, { useContext, useEffect, useRef, useState } from 'react';
import { CLOUD_NAME, UPLOAD_PRESET, cloudinaryConfig } from '../../keys';
import axios from 'axios';

import capitalize from '../../utility/capitalizeName';
import pen from '../../assets/pen2.jpg';
import { UserContext } from '../../App';
import instance from '../../baseUrlAxios'
import classes from './Profile.css'
import { useHistory } from 'react-router';
import Spinner from '../UI/Spinner/Spinner';

const Profile = (props) => {

    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const hiddenFileInput = useRef(null);
    const { user, dispatch } = useContext(UserContext);
    const history = useHistory();
    const axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    }

    useEffect(() => {

        setLoading(true);
        instance.get('/posts/my-posts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then((res) => {
                setMyPosts(res.data.posts.reverse());
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                props.ToastsStore.error(err.response.message);
            });

    }, [props.ToastsStore]);


    const uploadImage = (image) => {

        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', UPLOAD_PRESET);
        data.append('cloud_name', CLOUD_NAME);

        axios.post('https://api.cloudinary.com/v1_1/disha644/image/upload', data, cloudinaryConfig)
            .then(res => {

                instance.put('/users/update-profile-pic', { profileImage: res.data.url }, axiosConfig)
                    .then(response => {
                        localStorage.setItem('user', JSON.stringify({ ...user, profileImage: response.data.updatedUser.profileImage }));
                        dispatch({ type: 'UPDATE_PICTURE', image: response.data.updatedUser.profileImage });
                        props.ToastsStore.success('Image upload successful');
                    })
                    .catch(err => props.ToastsStore.error('Image upload failed'));

            })
            .catch(err => {
                props.ToastsStore.error('Please check your internet connection');
            });

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
        <div className={classes.Profile}>

            <div className={classes.header}>

                <div className={classes.container} onClick={() => hiddenFileInput.current.click()}>
                    <img src={user ? user.profileImage : null} alt="user_dp" className={classes.image1} />
                    <img src={pen} alt="update" className={classes.image2} />
                    <input
                        type="file"
                        name="filename"
                        accept="image/png, image/jpeg"
                        onChange={e => uploadImage(e.target.files[0])}
                        style={{ margin: '15px 0' }}
                        ref={hiddenFileInput}
                    />
                </div>

                <div>

                    <h2>{user ? capitalize(user.name) : 'Loading....'}</h2>
                    <p className={classes.email}>{user ? user.email : null}</p>

                    <div className={classes.counts}>
                        <p><strong>{myPosts.length}</strong> posts</p>
                        <p
                            onClick={() => history.push('/followers')}
                            style={{ cursor: 'pointer' }}>
                            <strong>{user ? user.followers.length : '0'}</strong> followers
                        </p>
                        <p
                            onClick={() => history.push('/following')}
                            style={{ cursor: 'pointer' }}>
                            <strong>{user ? user.following.length : '0'}</strong> following
                        </p>
                    </div>

                </div>
            </div>

            <div className={classes.gallery}>
                {posts}
            </div>
        </div>
    );
}

export default Profile;
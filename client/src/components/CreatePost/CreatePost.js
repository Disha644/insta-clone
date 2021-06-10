import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UPLOAD_PRESET, CLOUD_NAME, cloudinaryConfig } from '../../keys';
import axios from 'axios';

import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import Form from '../UI/Form/Form';
import Spinner from '../UI/Spinner/Spinner';
import classes from './CreatePost.css';


const CreatePost = (props) => {

    const history = useHistory();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const createPostHandler = (event) => {

        event.preventDefault();

        setLoading(true);
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', UPLOAD_PRESET);
        data.append('cloud_name', CLOUD_NAME);

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }

        axios.post('https://api.cloudinary.com/v1_1/disha644/image/upload', data, cloudinaryConfig)
            .then(res => {
                const post = { title, body, picture: res.data.url };
                axios.post('/posts/create-post', post, axiosConfig)
                    .then(res => {
                        setLoading(false);
                        props.ToastsStore.success('Post created successfully')
                        history.push('/');
                    })
                    .catch(err => {
                        setLoading(false);
                        props.ToastsStore.error(err.response.data.message)
                    })
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.data.error.message) {
                    console.log(err.response);
                    props.ToastsStore.error('Please select an image you want to upload');
                } else {
                    props.ToastsStore.error('Please check your internet connection');
                }
            });

    }

    let form = (
        <Form onSubmit={createPostHandler}>
            <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <Input
                type="text"
                placeholder="Body"
                value={body}
                onChange={e => setBody(e.target.value)}
            />
            <input
                type="file"
                name="filename"
                accept="image/png, image/jpeg"
                onChange={e => setImage(e.target.files[0])}
                style={{ margin: '15px 0' }}
            />
            <Button type="submit">Post Now</Button>
        </Form>
    );
    if (loading) {
        form = <Spinner />
    }

    return (
        <div className={classes.CreatePost}>
            {form}
        </div>
    )
}

export default CreatePost;
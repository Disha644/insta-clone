import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UPLOAD_PRESET, CLOUD_NAME, cloudinaryConfig } from '../../keys';
import axios from 'axios';

import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import Form from '../UI/Form/Form';
import Spinner from '../UI/Spinner/Spinner';
import instance from '../../baseUrlAxios';
import classes from './Signup.css';

const Signup = (props) => {

    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (url) {
            uploadData();
        }
    }, [url]);

    const uploadImage = () => {

        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', UPLOAD_PRESET);
        data.append('cloud_name', CLOUD_NAME);

        axios.post('https://api.cloudinary.com/v1_1/disha644/image/upload', data, cloudinaryConfig)
            .then(res => {
                setUrl(res.data.url)
            })
            .catch(err => {
                setLoading(false);
                console.log(err.response);
                //props.ToastsStore.error('Please check your internet connection')
            });

    }

    const uploadData = () => {

        const user = { name, email, password, profileImage: url };
        instance.post('/signup', user)
            .then((res) => {
                setLoading(false);
                props.ToastsStore.success(res.data.message);
                history.push('/signin');
            })
            .catch((err) => {
                setLoading(false);
                props.ToastsStore.error(err.response.data.message)
            });
    }

    const signUpHandler = (event) => {

        event.preventDefault();
        setLoading(true);
        if (image) {
            uploadImage();
        } else {
            uploadData();
        }

    }


    let form = (
        <Form onSubmit={signUpHandler}>
            <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                autoComplete="on"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <div style={{ width: '100%' }}>
                <p>Please select a profile picture (optional)</p>
                <input
                    type="file"
                    name="filename"
                    accept="image/png, image/jpeg"
                    onChange={e => setImage(e.target.files[0])}
                    style={{ margin: '15px 0' }}
                />
            </div>
            <Button type="submit">Sign up</Button>
        </Form>
    )

    if (loading) {
        form = <Spinner />
    }

    return (
        <>
            <div className={classes.Signup}>
                <h1>Instagram</h1>
                {form}
            </div>
        </>
    );
}

export default Signup;
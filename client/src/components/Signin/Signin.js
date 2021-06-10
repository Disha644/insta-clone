import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import Form from '../UI/Form/Form';
import Spinner from '../UI/Spinner/Spinner';
import axios from 'axios';
import capitalize from '../../utility/capitalizeName'
import { UserContext } from '../../App';
import classes from './Signin.css';

const Signin = (props) => {

    const { dispatch } = useContext(UserContext);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signInHandler = (event) => {

        event.preventDefault();
        setLoading(true);
        const userCredentials = { email, password };

        axios.post('/signin', userCredentials)
            .then((res) => {
                setLoading(false);
                localStorage.setItem('jwt', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                dispatch({ type: 'SET_USER', user: res.data.user });
                const name = capitalize(res.data.user.name);
                props.ToastsStore.success('Welcome ' + name + ', You have successfully signed in !!')
                history.push('/');
            })
            .catch((error) => {
                setLoading(false);
                props.ToastsStore.error(error.response.data.message)
            })

    }

    let form = (
        <Form onSubmit={signInHandler}>
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
            <Button type="submit">Sign In</Button>
        </Form>
    );
    if (loading) {
        form = <Spinner />
    }

    return (
        <div className={classes.Signin}>
            <h1>Instagram</h1>
            {form}
            <p className={classes.link}>
                Don't have an account?<Link to="/signup"> Sign up</Link>
            </p>
        </div>
    );
}

export default Signin;
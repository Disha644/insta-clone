import React from 'react';
import classes from './Input.css';

const Input = (props) => {
    return <input
        className={classes.Input}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        autoComplete={props.autoComplete}
        onChange={props.onChange}
    />
}

export default Input;
import React from 'react';
import classes from './Form.css';

const Form = (props) => {
    return <form onSubmit={props.onSubmit} className={classes.Form}>{props.children}</form>
}

export default Form;
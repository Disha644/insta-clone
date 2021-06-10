import React from 'react';
import classes from './Popup.css'

const Popup = (props) => {
    return (
        <div className={classes.Popup} style={{
            opacity: props.show ? 1 : 0,
            height: props.show ? '28px' : '0px',
            width: props.show ? '70px' : '0px',
            transition: 'all 0.3s ease-in-out'
        }}>
            <p onClick={props.delete}>Delete</p>
        </div>
    );
}

export default Popup;
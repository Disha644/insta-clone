import React, { useContext } from 'react';

import { UserContext } from '../../../App';
import classes from './Following.css';

const Following = (props) => {
    const { user } = useContext(UserContext);

    let following = null;
    if (user) {
        following = user.following.map(f => (
            <div key={f._id} className={classes.person}>
                <img src={f.profileImage} alt="user_image" />
                <div>
                    <p className={classes.name}>{f.name}</p>
                    <p className={classes.email}>{f.email}</p>
                </div>
            </div>
        ))
    }

    return (
        <div className={classes.Following}>
            <h3>Following</h3>
            {following}
        </div>
    )
}

export default Following;
import React, { useContext } from 'react';

import { UserContext } from '../../../App';
import classes from './Followers.css';

const Followers = (props) => {
    const { user } = useContext(UserContext);

    let followers = null;
    if (user) {
        followers = user.followers.map(f => (
            <div className={classes.follower} key={f._id}>
                <img src={f.profileImage} alt="user_image" />
                <div>
                    <p className={classes.name}>{f.name}</p>
                    <p className={classes.email}>{f.email}</p>
                </div>
            </div>
        ))
    }

    return (
        <div className={classes.Followers}>
            <h3>Followers</h3>
            {followers}
        </div>
    )
}

export default Followers;
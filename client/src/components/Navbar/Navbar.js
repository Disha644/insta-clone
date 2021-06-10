import React from 'react';

import NavigationItems from './NavigationItems/NavigationItems';
import classes from './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = (props) => {

    return (
        <div className={classes.Navbar}>
            <NavLink to='/all-posts'><h1>Instagram</h1></NavLink>
            <NavigationItems />
        </div>
    );
}

export default Navbar;
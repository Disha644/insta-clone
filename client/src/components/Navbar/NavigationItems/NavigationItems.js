import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../UI/Button/Button'
import { UserContext } from '../../../App';
import classes from './NavigationItems.css';
import { useHistory } from 'react-router';

const NavigationItems = (props) => {

    const { user, dispatch } = useContext(UserContext);
    const history = useHistory();

    const logout = () => {
        localStorage.clear();
        dispatch({ type: 'CLEAR' })
        history.push('/signin')
    }

    let renderList = (
        <div style={{ paddingRight: '10px' }}>
            <NavLink to='/signup' activeClassName={classes.active}>Sign up</NavLink>
            <NavLink to='/signin' activeClassName={classes.active}>Sign in</NavLink>
        </div>
    );
    if (user) {
        renderList = (
            <>
                <NavLink to='/' exact activeClassName={classes.active}>
                    <i className="fas fa-home"></i>
                </NavLink>
                <NavLink to='/profile' exact activeClassName={classes.active}>
                    <i className="fas fa-user-alt"></i>
                </NavLink>
                <NavLink to='/create-post' activeClassName={classes.active}>
                    <i className="fas fa-plus-circle"></i>
                </NavLink>
                <Button onClick={logout} >Logout</Button>
            </>
        )
    }
    return (
        <div className={classes.NavigationItems}>
            {renderList}
        </div>
    );
}

export default NavigationItems;
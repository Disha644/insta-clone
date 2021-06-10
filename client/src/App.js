import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ToastsContainer, ToastsStore } from 'react-toasts';

import Navbar from './components/Navbar/Navbar';
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import Profile from './components/Profile/Profile';
import UserProfile from './components/UserProfile/UserProfile';
import Home from './components/Home/Home';
import CreatePost from './components/CreatePost/CreatePost';
import Followers from './components/Profile/Followers/Followers';
import Following from './components/Profile/Following/Following';
import AllPosts from './components/AllPosts/AllPosts';
import { initialState, reducer } from './reducer/userReducer'
import classes from './App.css';

export const UserContext = createContext();

const Routing = () => {

  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'SET_USER', user })
    }
  }, [dispatch]);


  let routes = (
    <Switch>
      <Route path="/signup" component={() => <Signup ToastsStore={ToastsStore} />} />
      <Route path="/signin" component={() => <Signin ToastsStore={ToastsStore} />} />
      <Redirect to="/signin" />
    </Switch>
  );

  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    routes = (
      <Switch>
        <Route path="/profile/:id" component={() => <UserProfile ToastsStore={ToastsStore} />} />
        <Route path="/profile" exact component={() => <Profile ToastsStore={ToastsStore} />} />
        <Route path="/create-post" component={() => <CreatePost ToastsStore={ToastsStore} />} />
        <Route path="/followers" component={Followers} />
        <Route path="/following" component={Following} />
        <Route path="/all-posts" component={() => <AllPosts ToastsStore={ToastsStore} />} />
        <Route path="/" exact component={() => <Home ToastsStore={ToastsStore} />} />
        <Redirect to="/" />
      </Switch>
    )
  }

  return routes;
}

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ user: state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <ToastsContainer store={ToastsStore} lightBackground />
        <div className={classes.main}>
          <Routing />
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

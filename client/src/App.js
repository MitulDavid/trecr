import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PublicRecList from './components/reclist/PublicRecList';
import PrivateRoute from './components/routing/PrivateRoute';
import VerifyEmail from './components/layout/VerifyEmail';
import ResendVerification from './components/auth/ResendVerification';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

//Toast
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
//BurgerMenu
import './utils/BurgerMenu.css';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Route exact path='/' component={Landing} />
          <Switch>
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <Route exact path='/user/verify/:token' component={VerifyEmail} />
            <Route exact path='/user/resend' component={ResendVerification} />
            <Route
              exact
              path='/user/forgotpassword'
              component={ForgotPassword}
            />
            <Route
              exact
              path='/user/resetpassword/:token'
              component={ResetPassword}
            />
            <Route exact path='/:username' component={PublicRecList} />
          </Switch>
        </Fragment>
      </Router>
      <ToastContainer
        position='top-right'
        autoClose={6000}
        transition={Slide}
      />
    </Provider>
  );
};

export default App;

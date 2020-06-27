import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
//Toast-Notifications
import { ToastProvider } from 'react-toast-notifications';
//Redux
import { Provider } from 'react-redux';
import store from './store';

import './App.css';

const App = () => (
  <ToastProvider autoDismiss autoDismissTimeout={5000}>
    <Provider store={store}>
      <Router>
        <Fragment>
          <Route exact path='/' component={Landing} />
          <Switch>
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  </ToastProvider>
);

export default App;

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_RECLIST,
  CLEAR_SEARCH_RES,
  CLEAR_PINNEDLIST,
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register User
export const register = ({ username, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, email, password });
  try {
    const res = await axios.post('/api/users', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    toast.info(
      <p>
        A verification link has been sent to your email account, verify your
        email to complete the sign-up process <br /> <br />
        <a
          href='/user/resend'
          style={{
            color: 'black',
            background: 'white',
            padding: '8px',
            margin: '3px',
            borderRadius: '5px',
            fontWeight: '600',
          }}
        >
          Resend Verification
        </a>
      </p>,
      { autoClose: false }
    );
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg);
      });
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err);
    if (errors) {
      errors.forEach((error) => {
        //'Please verify your email to login' is what the api sends back, if the msg is changed in the api you have to change it here too
        if (error.msg !== 'Please verify your email to login')
          toast.error(error.msg);
        else
          toast.error(
            <p>
              Please verify your email to login. <br /> <br />
              <a
                href='/user/resend'
                style={{
                  color: 'black',
                  background: 'white',
                  padding: '8px',
                  margin: '3px',
                  borderRadius: '5px',
                  fontWeight: '600',
                }}
              >
                Resend Verification
              </a>
            </p>
          );
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Logout
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_RECLIST });
  dispatch({ type: CLEAR_SEARCH_RES });
  dispatch({ type: CLEAR_PINNEDLIST });
  dispatch({ type: LOGOUT });
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserBoardingImg from '../assets/UserBoardingImg.png';
import axios from 'axios';
import PropTypes from 'prop-types';

const ResetPassword = ({ match }) => {
  const [formData, setFormData] = useState({
    password: '',
    repassword: '',
  });

  const { password, repassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetPassword = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ password });
    try {
      await axios.post(
        `/api/users/resetpassword/${match.params.token}`,
        body,
        config
      );
      toast.success('Your password has been changed');
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else {
        toast.error('Request not valid');
      }
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== repassword) toast.error('Passwords do not match');
    else resetPassword();
  };

  return (
    <div className='signup-container'>
      <div className='ub-topbar'>
        <p className='ub-logo'>
          <Link to='/'>trecr</Link>
        </p>
        <p className='ub-logo-tag'>/ the • rec • room /</p>
      </div>
      <form className='login-form' onSubmit={onSubmit}>
        <h1 className='form-heading verify-form'>Reset Password</h1>
        <div className='form-grp'>
          <label className='form-label'>Password</label>
          <br />
          <input
            className='form-input'
            type='password'
            required={true}
            minLength='6'
            name='password'
            placeholder='Must contain atleast 6 characters'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-grp'>
          <label className='form-label'>Confirm Password</label>
          <br />
          <input
            className='form-input'
            type='password'
            required={true}
            name='repassword'
            placeholder='Retype your password'
            value={repassword}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='submit-btn' value='Change Password' />
        <p className='switch-form'>
          <Link to='/login'>
            <b>Log In</b>
          </Link>
        </p>
      </form>
      <div className='ub-image'>
        <img src={UserBoardingImg} alt='Sign up or login to trecr' />
      </div>
    </div>
  );
};

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ResetPassword;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserBoardingImg from '../assets/UserBoardingImg.png';
import axios from 'axios';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendFPLink = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email });
    try {
      await axios.post('/api/users/forgotpassword', body, config);
      toast.success(
        'An email has been sent to you with a link to reset your password'
      );
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else {
        toast.error('An error occured');
      }
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    sendFPLink();
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
        <h1 className='form-heading verify-form'>Forgot Your Password?</h1>
        <div className='form-grp'>
          <label className='form-label'>Email</label>
          <br />
          <input
            className='form-input'
            type='email'
            required={true}
            name='email'
            placeholder='Enter your email id'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='submit-btn' value='Reset Password' />
      </form>
      <div className='ub-image'>
        <img src={UserBoardingImg} alt='Sign up or login to trecr' />
      </div>
    </div>
  );
};

export default ForgotPassword;

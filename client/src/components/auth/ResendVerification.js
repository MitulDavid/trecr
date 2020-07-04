import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserBoardingImg from '../assets/UserBoardingImg.png';
import axios from 'axios';

const ResendVerification = () => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resendLink = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email });
    try {
      await axios.post('/api/users/resendverification', body, config);
      toast.success('A verificaiton email has been sent to your email id');
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
    resendLink();
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
        <h1 className='form-heading verify-form'>Resend Verification Email</h1>
        <div className='form-grp'>
          <label className='form-label'>Email</label>
          <br />
          <input
            className='form-input'
            // type='email'
            // required={true}
            name='email'
            placeholder='Enter your email id'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='submit-btn' value='Resend' />
      </form>
      <div className='ub-image'>
        <img src={UserBoardingImg} alt='Sign up or login to trecr' />
      </div>
    </div>
  );
};

export default ResendVerification;

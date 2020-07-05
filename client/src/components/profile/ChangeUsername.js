import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SettingsPage from '../assets/SettingsPage.svg';
import axios from 'axios';

const ChangeUsername = () => {
  const [formData, setFormData] = useState({
    password: '',
    username: '',
  });

  const { password, username } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const changeUsername = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ password, username });
    try {
      await axios.post('/api/users/changeusername', body, config);
      toast.success('Username changed');
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
    changeUsername();
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
        <h1 className='form-heading verify-form'>Change Username</h1>
        <div className='form-grp'>
          <label className='form-label'>New Username</label>
          <br />
          <input
            className='form-input'
            type='text'
            required={true}
            name='username'
            placeholder='Letters, numbers and underscore may be used'
            value={username.toLowerCase()}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-grp'>
          <label className='form-label'>Password</label>
          <br />
          <input
            className='form-input'
            type='password'
            required={true}
            name='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='submit-btn' value='Change Username' />
        <p className='switch-form'>
          <Link to='/'>
            <b>Go Back</b>
          </Link>
        </p>
      </form>
      <div className='ub-image account-ub-image'>
        <img src={SettingsPage} alt='Sign up or login to trecr' />
      </div>
    </div>
  );
};

export default ChangeUsername;

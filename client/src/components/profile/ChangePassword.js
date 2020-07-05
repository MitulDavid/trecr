import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SettingsPage from '../assets/SettingsPage.svg';
import axios from 'axios';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    newpassword: '',
    repassword: '',
  });

  const { password, newpassword, repassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const changePassword = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ password, newpassword });
    try {
      await axios.post('/api/users/changepassword', body, config);
      toast.success('Password changed');
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
    if (newpassword !== repassword) toast.error('Passwords do not match');
    else changePassword();
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
        <h1 className='form-heading verify-form'>Change Password</h1>
        <div className='form-grp'>
          <label className='form-label'>Current Password</label>
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
        <div className='form-grp'>
          <label className='form-label'>New Password</label>
          <br />
          <input
            className='form-input'
            type='password'
            required={true}
            // minLength='6'
            name='newpassword'
            placeholder='Must contain atleast 6 characters'
            value={newpassword}
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

export default ChangePassword;

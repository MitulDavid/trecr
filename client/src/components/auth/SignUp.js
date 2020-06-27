import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import UserBoardingImg from '../assets/UserBoardingImg.png';
const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
  });

  const { username, email, password, repassword } = formData;
  const { addToast } = useToasts();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== repassword) {
      addToast('Passwords do not match', { appearance: 'error' });
    } else {
      console.log(formData);
      //@todo: add action
    }
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
        <h1 className='form-heading'>Sign Up</h1>
        <div className='form-grp'>
          <label className='form-label'>Username</label>
          <br />
          <input
            className='form-input'
            type='text'
            required={true}
            name='username'
            placeholder='Letters, numbers and underscore'
            value={username}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-grp'>
          <label className='form-label'>Email</label>
          <br />
          <input
            className='form-input'
            type='email'
            required={true}
            name='email'
            placeholder='johndoe@gmail.com'
            value={email}
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
        <input type='submit' className='submit-btn' value='Sign Up' />
        <p className='switch-form'>
          Already Registered?{' '}
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

export default SignUp;

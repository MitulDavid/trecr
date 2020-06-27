import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserBoardingImg from '../assets/UserBoardingImg.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    //@todo: add action
  };

  return (
    <div className='signup-container'>
      <div className='ub-topbar'>
        <p className='ub-logo'>
          <Link to='/'>trecr</Link>
        </p>
        <p className='ub-logo-tag'>/ the • rec • room /</p>
      </div>
      <form onSubmit={onSubmit} className='login-form'>
        <h1 className='form-heading'>Log In</h1>
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
        <div className='form-grp'>
          <label className='form-label'>Password</label>
          <br />
          <input
            className='form-input frgt-pswrd-exp'
            type='password'
            required={true}
            name='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => onChange(e)}
          />
          <div className='frgt-pswrd'>
            {/* @todo: add func for forgot password */}
            <Link to=''>Forgot your password?</Link>
          </div>
        </div>
        <input type='submit' className='submit-btn' value='Log In' />
        <p className='switch-form'>
          Don't have an account?{' '}
          <Link to='/signup'>
            <b>Sign Up</b>
          </Link>
        </p>
      </form>
      <div className='ub-image'>
        <img src={UserBoardingImg} alt='Sign up or login to trecr' />
      </div>
    </div>
  );
};

export default Login;

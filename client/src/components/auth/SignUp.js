import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import { toast } from 'react-toastify';
import UserBoardingImg from '../assets/UserBoardingImg.png';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const SignUp = ({ register, isAuthenticated }) => {
  const recaptchaRef = React.createRef();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
  });

  const { username, email, password, repassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== repassword) {
      toast.error('Passwords do not match');
    } else {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        recaptchaRef.current.reset();
        const token = await recaptchaRef.current.executeAsync();

        const body = JSON.stringify({ captcha: token });
        await axios.post('/api/auth/verifycaptcha', body, config);

        register({ username, email, password });
      } catch (err) {
        toast.error('reCaptcha failed. Please try again');
      }
    }
  };

  //Redirect if Logged In
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

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
            placeholder='Letters, numbers and underscore may be used'
            value={username.toLowerCase()}
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
            placeholder='Enter your email id'
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
        <input type='submit' className='submit-btn' value='Sign Up' />
        <p className='switch-form'>
          Already Registered?{' '}
          <Link to='/login'>
            <b>Log In</b>
          </Link>
        </p>
        <ReCAPTCHA
          ref={recaptchaRef}
          size='invisible'
          sitekey='6LcXD68ZAAAAAG3ynckKmUXFUEXamuQCSmUhHF5k'
        />
      </form>
      <div className='ub-image'>
        <img src={UserBoardingImg} alt='Sign up or login to trecr' />
      </div>
    </div>
  );
};

SignUp.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(SignUp);

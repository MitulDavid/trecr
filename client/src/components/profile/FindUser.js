import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import FindUserImg from '../assets/FindUserImg.svg';
import Footer from '../layout/Footer';

const FindUser = () => {
  const [formData, setFormData] = useState({
    username: '',
  });

  const history = useHistory();
  const { username } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (username.length <= 0) toast.error('The username cannot be empty');
    else if (username.length > 20 || !username.match(/^[a-zA-Z0-9_]+$/i))
      toast.error('That is not a valid username');
    else {
      history.push(`/${username}`);
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
        <h1 className='form-heading verify-form'>Find by Username</h1>
        <div className='form-grp'>
          <input
            className='form-input'
            type='text'
            required={true}
            name='username'
            placeholder={`Enter a username to find their rec.list`}
            value={username.toLowerCase()}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='submit-btn' value='Find' />
        <p className='switch-form'>
          <Link to='/'>
            <b>Go Back</b>
          </Link>
        </p>
      </form>
      <div className='ub-image find-user-img'>
        <img src={FindUserImg} alt='Find User' />
      </div>
      <Footer />
    </div>
  );
};

export default FindUser;

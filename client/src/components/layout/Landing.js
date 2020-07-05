import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import EllipseIcon from '../assets/Icons/EllipseIcon.svg';
import HompageImg from '../assets/HompageImg.png';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <div className='home-container'>
      <div className='home-nav'>
        <Link to='/login' className='home-btn login-btn'>
          LOG IN
        </Link>

        <Link to='/signup' className='home-btn signup-btn'>
          SIGN UP
        </Link>
      </div>
      <div className='home-content'>
        <h1 className='home-title'>trecr</h1>
        <h2 className='home-subtitle'>/ the • rec • room /</h2>
        <p className='home-tagline'>
          A quick and easy way to share your favourite movies and shows.
        </p>
        <ul className='instructions'>
          <li>
            <img
              src={EllipseIcon}
              alt='List decoration'
              className='bullet big'
            />
            Sign Up
          </li>
          <li>
            <img
              src={EllipseIcon}
              alt='List decoration'
              className='bullet big'
            />
            Search for movies or shows and add them to your list
          </li>
          <li>
            <img
              src={EllipseIcon}
              alt='List decoration'
              className='bullet big'
            />
            Share your list with the link: trecr.com/your_username
          </li>
        </ul>
      </div>
      <div className='home-image'>
        <img src={HompageImg} alt='Welcome to trecr' />
      </div>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(Landing);

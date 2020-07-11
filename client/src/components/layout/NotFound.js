import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import VerifyErrorIcon from '../assets/Icons/VerifyErrorIcon.svg';
const NotFound = () => {
  return (
    <Fragment>
      <div className='verify-container'>
        <div className='verify-topbar'>
          <p className='ub-logo verify-logo'>trecr</p>
          <p className='ub-logo-tag verify-logo'>/ the • rec • room /</p>
        </div>
        <div className='verify-msg'>
          <img
            src={VerifyErrorIcon}
            className='verify-icon'
            alt='InvalidLink'
          />
          <div className='verify-heading'>There's nothing here</div>
          <div className='verify-subhead'>
            The page you are looking for could not be found.
          </div>
          <Link to='/' className='submit-btn verify-btn'>
            Head Back
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default NotFound;

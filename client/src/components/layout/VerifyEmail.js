import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import VerifySuccessIcon from '../assets/Icons/VerifySuccessIcon.svg';
import VerifyErrorIcon from '../assets/Icons/VerifyErrorIcon.svg';

const VerifyEmail = ({ match }) => {
  useEffect(() => {
    VerifyEmailAPI();
  }, []);

  const [response, setResponse] = useState({
    resStatus: false,
  });

  const VerifyEmailAPI = async () => {
    try {
      await axios.get(`/api/users/confirmation/${match.params.token}`);
      setResponse({ resStatus: true });
    } catch (err) {
      setResponse({ resStatus: false });
    }
  };

  const { resStatus } = response;
  if (resStatus)
    return (
      <Fragment>
        <div className='verify-container'>
          <div className='verify-topbar'>
            <p className='ub-logo verify-logo'>trecr</p>
            <p className='ub-logo-tag verify-logo'>/ the • rec • room /</p>
          </div>
          <div className='verify-msg'>
            <img
              src={VerifySuccessIcon}
              className='verify-icon'
              alt='InvalidLink'
            />
            <div className='verify-heading'>
              Your Account Has <br /> Been Verified
            </div>
            <div className='verify-subhead'>
              Welcome to trecr! You're all done with the sign up process, head
              back to start working on your list.
            </div>
            <Link to='/' className='submit-btn verify-btn'>
              Head Back
            </Link>
          </div>
        </div>
      </Fragment>
    );
  else
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
            <div className='verify-heading'>This link isn't working</div>
            <div className='verify-subhead'>
              We were unable to verify your email account because this link is
              not valid. <br />
              <br />
              Verification links expire after a few hours. Want us to send you
              another link?
            </div>
            <Link to='/user/resend' className='submit-btn verify-btn'>
              Resend Link
            </Link>
          </div>
        </div>
      </Fragment>
    );
};

VerifyEmail.propTypes = {
  match: PropTypes.object.isRequired,
};

export default VerifyEmail;

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import PinIcon from '../assets/Icons/PinIcon.svg';

const PublicRecList = () => {
  return (
    <Fragment>
      <Navbar />
      <div className='user-rec-list'>
        <nav className='r-nav'>
          <div className='nav-logo'>
            <div className='nav-logo-title'>trecr</div>
            <div className='nav-logo-username'>@mituldavid</div>
          </div>

          {/* <div className="nav-menu">
                <div className="nav-menu-btn nav-signup-btn"><Link to="/signup">SIGN UP</Link></div>
                <div className="nav-menu-btn nav-login-btn"><Link to="/login">LOG IN</Link></div>
            </div> */}
        </nav>
        <div className='rec-case'>
          <div className='rec-showcase'>
            <img
              src={
                'https://image.tmdb.org/t/p/w780/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg'
              }
              alt='Movie Poster'
              className='rs-poster'
            />
            <div className='rs-title'>Arrival</div>
            <div className='rs-details'>
              {' '}
              8.1 | English | Drama, Mystery, Sci-Fi | 10 November 2016{' '}
            </div>
            <div className='rs-like'>
              <svg
                className='rs-like-icon'
                xmlns='http://www.w3.org/2000/svg'
                width='44'
                height='44'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='#E02F2F'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' />
                <path d='M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7' />
              </svg>
              <div className='rs-like-count'>123</div>
            </div>
          </div>
          <div className='rec-list'>
            <div className='rl-header'>
              <div className='rl-heading'>the.rec.list</div>{' '}
              <Link className='pin-list' to=''>
                <img src={PinIcon} alt='Pin List' />
              </Link>
              <div className='rl-subheading'>mituldavid's recommendations</div>
            </div>
            <div className='rl-grid'>
              <div className='rl-entry'>
                <img
                  src={
                    'https://image.tmdb.org/t/p/w154/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg'
                  }
                  alt='Movie Poster'
                  className='rl-poster'
                />
                <div className='rl-greybox'>
                  <div className='rl-title'>Spiderman Into the Spiderverse</div>
                  <div className='rl-details'>
                    8.1 | English | Drama, Mystery, Sci-Fi | 10 November 2016
                  </div>
                </div>
                <div className='rl-utility'>
                  <div className='rl-like'>
                    <svg
                      className='rl-like-icon'
                      xmlns='http://www.w3.org/2000/svg'
                      width='44'
                      height='44'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='#E02F2F'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' />
                      <path d='M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7' />
                    </svg>
                    <div className='rl-like-count'>123</div>
                  </div>
                </div>
              </div>
              <div className='rl-entry'>
                <img
                  src={
                    'https://image.tmdb.org/t/p/w154/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg'
                  }
                  alt='Movie Poster'
                  className='rl-poster'
                />
                <div className='rl-greybox'>
                  <div className='rl-title'>Spiderman Into the Spiderverse</div>
                  <div className='rl-details'>
                    8.1 | English | Drama, Mystery, Sci-Fi | 10 November 2016
                  </div>
                </div>
                <div className='rl-utility'>
                  <div className='rl-like'>
                    <svg
                      className='rl-like-icon'
                      xmlns='http://www.w3.org/2000/svg'
                      width='44'
                      height='44'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='#E02F2F'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' />
                      <path d='M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7' />
                    </svg>
                    <div className='rl-like-count'>123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PublicRecList;

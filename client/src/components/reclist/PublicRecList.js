import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PublicRecEntry from './PublicRecEntry';
import PublicRecShow from './PublicRecShow';
import Spinner from '../layout/Spinner';
import VerifyErrorIcon from '../assets/Icons/VerifyErrorIcon.svg';

import { getReclistByUsername } from '../../actions/reclist';
import { pinList } from '../../actions/pinnedlist';
import NavMenu from '../layout/NavMenu';
import PinIcon from '../assets/Icons/PinIcon.svg';

const PublicRecList = ({
  match,
  getReclistByUsername,
  pinList,
  reclist: { loading, error, viewlist },
}) => {
  useEffect(() => {
    getReclistByUsername(match.params.username);
  }, []);
  const onClick = (id) => pinList(id);

  if (loading && viewlist === null) {
    return (
      <div className='spinner-container'>
        <Spinner />
      </div>
    );
  } else if (
    // error.msg === 'This user does not have any recommendations' ||
    // error.msg === 'This user does not exist' ||
    // error.msg === 'Internal Server Error' ||
    viewlist === null ||
    viewlist.r_list.length <= 0 ||
    viewlist.r_list === null
  ) {
    return (
      <Fragment>
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
                This user either does not exist or doesn't have any
                recommendations yet.
              </div>
              <Link to='/' className='submit-btn verify-btn'>
                Head Back
              </Link>
            </div>
          </div>
        </Fragment>
      </Fragment>
    );
  } else if (viewlist !== null) {
    return (
      <Fragment>
        <NavMenu />
        <div className='user-rec-list'>
          <nav className='r-nav'>
            <div className='nav-logo'>
              <Link to='/' className='nav-logo-title'>
                trecr
              </Link>
              <div className='nav-logo-username'>
                @{viewlist && viewlist.user_id.username}
              </div>
            </div>
          </nav>
          <div className='rec-case'>
            <div className='rec-showcase'>
              <PublicRecShow />
            </div>
            <div className='rec-list'>
              <div className='rl-header'>
                <div className='rl-heading'>the.rec.list</div>{' '}
                <span
                  className='pin-list'
                  onClick={() => onClick(viewlist.user_id._id)}
                >
                  <img src={PinIcon} alt='Pin List' />
                </span>
                <div className='rl-subheading'>
                  {viewlist && viewlist.user_id.username}'s recommendations
                </div>
              </div>
              <div className='rl-grid'>
                <PublicRecEntry />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  } else {
    //@todo: Add Page Design
    return (
      <Fragment>
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
              <div className='verify-heading'>All out of recommendations</div>
              <div className='verify-subhead'>
                This user either does not exist or doesn't have any
                recommendations yet.
              </div>
              <Link to='/' className='submit-btn verify-btn'>
                Head Back
              </Link>
            </div>
          </div>
        </Fragment>
      </Fragment>
    );
  }
};

PublicRecList.propTypes = {
  getReclistByUsername: PropTypes.func.isRequired,
  reclist: PropTypes.object.isRequired,
  pinList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
});

export default connect(mapStateToProps, { getReclistByUsername, pinList })(
  PublicRecList
);

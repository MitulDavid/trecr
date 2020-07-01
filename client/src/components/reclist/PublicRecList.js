import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PublicRecEntry from './PublicRecEntry';
import PublicRecShow from './PublicRecShow';

import { getReclistByUsername } from '../../actions/reclist';
import NavMenu from '../layout/NavMenu';
import PinIcon from '../assets/Icons/PinIcon.svg';

const PublicRecList = ({
  match,
  getReclistByUsername,
  reclist,
  reclist: { loading, error, viewlist },
}) => {
  useEffect(() => {
    getReclistByUsername(match.params.username);
  }, []);

  if (loading && viewlist === null) {
    return <Fragment>Spinner</Fragment>;
  } else if (
    error.msg === 'This user does not have any recommendations' ||
    error.msg === 'This user does not exist' ||
    error.msg === 'Internal Server Error' ||
    reclist === null /*Cheeky lil error causer*/ ||
    viewlist.r_list.length <= 0 ||
    viewlist.r_list === null
  ) {
    return (
      <Fragment>
        This user either doesnt exist or doesnt have any recs yet screen
      </Fragment>
    );
  } else if (viewlist !== null) {
    const randomEntry =
      viewlist.r_list[Math.floor(Math.random() * viewlist.r_list.length)];
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
                <Link className='pin-list' to=''>
                  <img src={PinIcon} alt='Pin List' />
                </Link>
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
    return <Fragment>Error</Fragment>;
  }
};

PublicRecList.propTypes = {
  getReclistByUsername: PropTypes.func.isRequired,
  reclist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
});

export default connect(mapStateToProps, { getReclistByUsername })(
  PublicRecList
);

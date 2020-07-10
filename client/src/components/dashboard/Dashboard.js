import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import NavMenu from '../layout/NavMenu';
import SearchEntry from './SearchEntry';
import SearchResults from './SearchResults';
import DashRecList from './DashRecList';
import { getCurrentReclist } from '../../actions/reclist';

const Dashboard = ({
  getCurrentReclist,
  auth: { user },
  reclist: { reclist, loading },
}) => {
  useEffect(() => {
    getCurrentReclist();
  }, [getCurrentReclist]);
  return loading && reclist === null ? (
    <div className='spinner-container'>
      <Spinner />
    </div>
  ) : (
    <Fragment>
      <NavMenu />
      <div className='user-rec-list'>
        <nav className='r-nav'>
          <div className='nav-logo'>
            <div className='nav-logo-title'>trecr</div>
            <div className='nav-logo-username'>
              @
              {reclist !== null && reclist.user_id.username
                ? reclist.user_id.username
                : user && user.username}
            </div>
          </div>
        </nav>
        <div className='rec-case'>
          <div className='rec-showcase'>
            <SearchEntry />
            <div className='search-res-grid'>
              <SearchResults />
            </div>
          </div>
          <div className='rec-list'>
            <div className='rl-header'>
              <div className='rl-heading'>your.rec.list</div>
              <div className='rl-subheading'>
                add or remove entries from your list
              </div>
            </div>
            <div className='rl-grid'>
              <DashRecList />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentReclist: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  reclist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentReclist })(Dashboard);

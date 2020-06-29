import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import NavMenu from '../layout/NavMenu';
import SearchEntry from './SearchEntry';
import SearchResults from './SearchResults';
import { getCurrentReclist } from '../../actions/reclist';

const Dashboard = ({
  getCurrentReclist,
  auth: { user },
  reclist: { reclist, loading },
}) => {
  useEffect(() => {
    getCurrentReclist();
  }, []);
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
            <div className='nav-logo-username'>@{user && user.username}</div>
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
            {reclist !== null ? (
              <Fragment>Has</Fragment>
            ) : (
              <Fragment>HasNot</Fragment>
            )}
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
  auth: state.auth,
  reclist: state.reclist,
});

export default connect(mapStateToProps, { getCurrentReclist })(Dashboard);

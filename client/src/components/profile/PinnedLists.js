import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPinnedList, unpinList } from '../../actions/pinnedlist';
import Spinner from '../layout/Spinner';
import NavMenu from '../layout/NavMenu';
import CloseIcon from '../assets/Icons/CloseIcon.svg';
import Footer from '../layout/Footer';

const PinnedLists = ({
  user,
  isAuthenticated,
  pinnedlist: { pinnedlist, loading, error },
  getPinnedList,
  unpinList,
}) => {
  useEffect(() => {
    getPinnedList();
  }, [getPinnedList]);
  const onClick = (id) => unpinList(id);
  if (loading && pinnedlist === null)
    return (
      <div className='spinner-container'>
        <Spinner />
      </div>
    );
  else if (
    pinnedlist === null ||
    pinnedlist.p_list.length <= 0 ||
    pinnedlist.p_list === null
  )
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
                {isAuthenticated &&
                  user.username != null &&
                  `@${user.username}`}
              </div>
            </div>
          </nav>
          <div className='pinnedlist-container'>
            <div className='plist-heading-container'>
              <div className='rl-heading'>pinned.list</div>
              <div className='rl-subheading plist-subheading'>
                click on a list to view it
              </div>
            </div>
            <div className='plist-grid'>
              <div className='plist-entry plist-null'>
                <div className='plist-msg'>
                  <div className='ae-msg-main plist-uname'>
                    There's nothing here
                  </div>
                  <div className='ae-msg-sub plist-sub'>
                    You haven't pinned any lists yet
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  else {
    const pentry = pinnedlist.p_list.map((pentry) => (
      <div className='plist-entry' key={pentry._id}>
        <Link to={`/${pentry.user.username}`} className='plist-msg'>
          <div className='ae-msg-main plist-uname'>{pentry.user.username}</div>
          <div className='ae-msg-sub plist-sub'>
            trecr.com/{pentry.user.username}
          </div>
        </Link>
        <img
          className='rmv-plist'
          src={CloseIcon}
          alt='Remove from list'
          onClick={() => onClick(pentry.user._id)}
        />
      </div>
    ));
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
                @{pinnedlist.user_id.username}
              </div>
            </div>
          </nav>
          <div className='pinnedlist-container'>
            <div className='plist-heading-container'>
              <div className='rl-heading'>pinned.list</div>
              <div className='rl-subheading plist-subheading'>
                click on a list to view it
              </div>
            </div>
            <div className='plist-grid'>{pentry}</div>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
};

PinnedLists.propTypes = {
  pinnedlist: PropTypes.object.isRequired,
  getPinnedList: PropTypes.func.isRequired,
  unpinList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  pinnedlist: state.pinnedlist,
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getPinnedList, unpinList })(
  PinnedLists
);

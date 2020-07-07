import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

import crossIcon from '../assets/Icons/X.svg';
import SettingIcon from '../assets/Icons/SettingIcon.svg';
import LogoutIcon from '../assets/Icons/LogoutIcon.svg';
import MenuPinIcon from '../assets/Icons/MenuPinIcon.svg';
import MenuSearchIcon from '../assets/Icons/MenuSearchIcon.svg';
import DashboardIcon from '../assets/Icons/DashboardIcon.svg';

const NavMenu = ({ auth: { isAuthenticated, loading }, logout }) => {
  const [MenuState, setMenuState] = useState({
    isOpen: false,
  });

  const { isOpen } = MenuState;

  const guestLinks = (
    <Fragment>
      <Link to='/signup' className='menu-item cta'>
        <div className='menu-item-cta signup-cta'>SIGN UP</div>
      </Link>
      <Link to='/login' className='menu-item cta'>
        <div className='menu-item-cta login-cta'>LOG IN</div>
      </Link>
    </Fragment>
  );

  const authLinks = (
    <Fragment>
      <Link to='/dashboard' className='menu-item'>
        <img src={DashboardIcon} className='menuIcon' alt='MenuIcon' />
        Dashboard
      </Link>
      <Link to='/dashboard/pinnedlists' className='menu-item'>
        <img src={MenuPinIcon} className='menuIcon' alt='MenuIcon' />
        Pinned Lists
      </Link>
      <Link to='' className='menu-item'>
        <img src={MenuSearchIcon} className='menuIcon' alt='MenuIcon' />
        Search by Username
      </Link>
      <div
        className='menu-item'
        onClick={(e) =>
          setMenuState({ ...MenuState, isOpen: !MenuState.isOpen })
        }
      >
        <img src={SettingIcon} className='menuIcon' alt='MenuIcon' />
        Settings
      </div>
      {isOpen && (
        <Fragment>
          <Link
            to='/account/changeusername'
            className='menu-item menu-sub-item msi-one'
          >
            Change Username
          </Link>
          <Link
            to='/account/changepassword'
            className='menu-item menu-sub-item msi-two'
          >
            Change Password
          </Link>
        </Fragment>
      )}

      <Link to='#!' onClick={logout} className='menu-item'>
        <img src={LogoutIcon} className='menuIcon' alt='MenuIcon' />
        Logout
      </Link>
    </Fragment>
  );

  return (
    <Menu
      right
      disableAutoFocus
      customCrossIcon={<img src={crossIcon} alt='CloseMenuIcon' />}
    >
      {!loading && (isAuthenticated ? authLinks : guestLinks)}
    </Menu>
  );
};

NavMenu.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(NavMenu);

import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import crossIcon from '../assets/Icons/X.svg';
import SettingIcon from '../assets/Icons/SettingIcon.svg';
import LogoutIcon from '../assets/Icons/LogoutIcon.svg';
import MenuPinIcon from '../assets/Icons/MenuPinIcon.svg';
import MenuSearchIcon from '../assets/Icons/MenuSearchIcon.svg';
import DashboardIcon from '../assets/Icons/DashboardIcon.svg';
const Navbar = () => {
  return (
    <Menu
      right
      disableAutoFocus
      customCrossIcon={<img src={crossIcon} alt='CloseMenuIcon' />}
    >
      <Link to='' className='menu-item'>
        <img src={DashboardIcon} className='menuIcon' alt='MenuIcon' />
        Dashboard
      </Link>
      <Link to='' className='menu-item'>
        <img src={MenuPinIcon} className='menuIcon' alt='MenuIcon' />
        Pinned Lists
      </Link>
      <Link to='' className='menu-item'>
        <img src={MenuSearchIcon} className='menuIcon' alt='MenuIcon' />
        Search by Username
      </Link>
      <Link to='' className='menu-item'>
        <img src={SettingIcon} className='menuIcon' alt='MenuIcon' />
        Account Settings
      </Link>
      <Link to='' className='menu-item'>
        <img src={LogoutIcon} className='menuIcon' alt='MenuIcon' />
        Logout
      </Link>
    </Menu>
  );
};

export default Navbar;

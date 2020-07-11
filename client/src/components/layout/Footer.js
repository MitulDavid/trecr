import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '../assets/Icons/instagram.svg';
import LinkedInIcon from '../assets/Icons/linkedin.svg';
import DiscordIcon from '../assets/Icons/discord.svg';
const Footer = () => {
  return (
    <footer>
      <div className='footer-social'>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.instagram.com/mituldavid/'
        >
          <img className='ft-img' src={InstagramIcon} alt='SocialIcons' />
        </a>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.linkedin.com/in/mituldavid/'
        >
          <img className='ft-img' src={LinkedInIcon} alt='SocialIcons' />
        </a>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='http://discord.gg/9MEzZXB'
        >
          <img
            className='ft-img ft-discord'
            src={DiscordIcon}
            alt='SocialIcons'
          />
        </a>
      </div>
      <Link to='/' className='footer-t'>
        trecr
      </Link>
      <div className='footer-cr'>
        &copy; Copyright Mitul David |{' '}
        <Link target='_blank' to='/attributions'>
          Attributions
        </Link>{' '}
        | Report bugs at{' '}
        <a
          href='http://discord.gg/9MEzZXB'
          rel='noopener noreferrer'
          target='_blank'
        >
          http://discord.gg/9MEzZXB
        </a>
      </div>
    </footer>
  );
};

export default Footer;

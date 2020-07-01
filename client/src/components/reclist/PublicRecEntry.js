import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LName } from '../../utils/LangArray';
import moment from 'moment';
import NoPosterFound from '../assets/NoPosterFound.png';
import { Fragment } from 'react';

const PublicRecEntry = ({ reclist }) => {
  if (
    reclist.viewlist !== null &&
    reclist.viewlist.r_list !== null &&
    reclist.viewlist.r_list.length > 0
  ) {
    const rl_entries = reclist.viewlist.r_list.map((rle) => (
      <div className='rl-entry' key={rle._id}>
        <img
          src={`https://image.tmdb.org/t/p/w154/${rle.poster_path}`}
          alt='Movie Poster'
          className='rl-poster'
          onError={(e) => {
            e.target.onError = null;
            e.target.src = NoPosterFound;
          }}
        />
        <div className='rl-greybox'>
          <div className='rl-title'>{rle.title}</div>
          <div className='rl-details'>
            &#128970; {rle.rating} | {LName[rle.language]} |{' '}
            {rle.genre.join(', ')} |{' '}
            {moment(rle.release_date, 'YYYY-MM-DD').format('DD MMM YYYY')}
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
            <div className='rl-like-count'>
              {rle.likes.length > 0 && rle.likes.length}
            </div>
          </div>
        </div>
      </div>
    ));
    return <Fragment>{rl_entries}</Fragment>;
  } else return <Fragment></Fragment>;
};

PublicRecEntry.propTypes = {
  reclist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
});

export default connect(mapStateToProps)(PublicRecEntry);

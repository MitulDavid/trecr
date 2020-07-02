import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LName } from '../../utils/LangArray';
import moment from 'moment';
import NoPosterFound from '../assets/NoPosterFound.png';

const PublicRecShow = ({ reclist: { loading, error, viewlist } }) => {
  const [randEntry, setRandEntry] = useState({
    randomEntry: viewlist.r_list[0],
  });
  useEffect(() => {
    setRandEntry({
      randomEntry:
        viewlist.r_list[Math.floor(Math.random() * viewlist.r_list.length)],
    });
  }, []);
  const { randomEntry } = randEntry;
  // const randomEntry =
  //   viewlist.r_list[Math.floor(Math.random() * viewlist.r_list.length)];
  return (
    <Fragment>
      <img
        src={`https://image.tmdb.org/t/p/w780/${randomEntry.poster_path}`}
        alt='Movie Poster'
        className='rs-poster'
        onError={(e) => {
          e.target.onError = null;
          e.target.src = NoPosterFound;
        }}
      />
      <div className='rs-title'>{randomEntry.title}</div>
      <div className='rs-details'>
        &#128970; {randomEntry.rating} | {LName[randomEntry.language]} |{' '}
        {randomEntry.genre.join(', ')} |{' '}
        {moment(randomEntry.release_date, 'YYYY-MM-DD').format('DD MMM YYYY')}
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
        <div className='rs-like-count'>
          {randomEntry.likes.length > 0 && randomEntry.likes.length}
        </div>
      </div>
    </Fragment>
  );
};

PublicRecShow.propTypes = {
  reclist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
});

export default connect(mapStateToProps)(PublicRecShow);

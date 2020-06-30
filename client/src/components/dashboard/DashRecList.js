import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fragment } from 'react';
import { LName } from '../../utils/LangArray';
import moment from 'moment';
import NoPosterFound from '../assets/NoPosterFound.png';
import CloseIcon from '../assets/Icons/CloseIcon.svg';
import AddIcon from '../assets/Icons/AddIcon.svg';

const DashRecList = ({ reclist }) => {
  if (reclist.reclist !== null && reclist.reclist.r_list !== null) {
    const rec_entries = reclist.reclist.r_list.map((re) => {
      const dashlikes =
        re.likes.length > 0 ? (
          <div className='dash-like'>
            <svg
              className='dash-like-icon'
              xmlns='http://www.w3.org/2000/svg'
              width='44'
              height='44'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='#E02F2F'
              fill='none'
              stroke-linecap='round'
              stroke-linejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' />
              <path d='M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7' />
            </svg>
            <div className='dash-like-count'>{re.likes.length}</div>
          </div>
        ) : (
          ''
        );
      return (
        <div className='rl-entry' key={re.id}>
          <img
            src={`https://image.tmdb.org/t/p/w154/${re.poster_path}`}
            alt='Movie Poster'
            className='rl-poster'
            onError={(e) => {
              e.target.onError = null;
              e.target.src = NoPosterFound;
            }}
          />
          <div className='rl-greybox'>
            <div className='rl-title'>{re.title}</div>
            <div className='rl-details'>
              &#128970; {re.rating} | {LName[re.language]} |{' '}
              {re.genre.join(', ')} |{' '}
              {moment(re.release_date, 'YYYY-MM-DD').format('DD MMM YYYY')}
            </div>
          </div>
          <div className='rl-utility'>
            <img className='rmv-entry' src={CloseIcon} alt='Remove from list' />
          </div>
        </div>
      );
    });
    return <Fragment>{rec_entries}</Fragment>;
  } else {
    return (
      <Fragment>
        <div className='rl-entry'>
          <div className='rl-poster-placeholder'></div>
          <div className='add-entry-msg'>
            <div className='ae-msg-main'>Add a new entry</div>
            <div className='ae-msg-sub'>Your list can hold upto 10 entries</div>
          </div>

          <div className='rl-utility'>
            <img className='rmv-entry' src={AddIcon} alt='Add to list' />
          </div>
        </div>
      </Fragment>
    );
  }
};

DashRecList.propTypes = {
  reclist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
});

export default connect(mapStateToProps)(DashRecList);

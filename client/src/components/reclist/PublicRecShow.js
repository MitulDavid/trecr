import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LName } from '../../utils/LangArray';
import moment from 'moment';
import NoPosterFound from '../assets/NoPosterFound.png';
import { toast } from 'react-toastify';
import { addLike, removeLike } from '../../actions/reclist';
const PublicRecShow = ({
  reclist: { loading, error, viewlist },
  auth,
  addLike,
  removeLike,
}) => {
  const [randEntry, setRandEntry] = useState({
    randomEntry: viewlist.r_list[0],
  });
  useEffect(() => {
    setRandEntry({
      randomEntry:
        viewlist.r_list[Math.floor(Math.random() * viewlist.r_list.length)],
    });
    // eslint-disable-next-line
  }, []);
  const { randomEntry } = randEntry;
  const rmvLike = (reclist_id, rle_id) => {
    removeLike(reclist_id, rle_id);
  };
  const Like = (reclist_id, rle_id) => {
    addLike(reclist_id, rle_id);
  };

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
      <div
        className='rs-like'
        onClick={(e) =>
          auth.isAuthenticated
            ? viewlist.r_list
                .filter((re) => re._id === randomEntry._id)[0]
                .likes.filter((like) => like.user === auth.user._id).length > 0
              ? rmvLike(viewlist._id, randomEntry._id)
              : Like(viewlist._id, randomEntry._id)
            : toast.error('Log in to like entries')
        }
      >
        <svg
          className='rs-like-icon'
          xmlns='http://www.w3.org/2000/svg'
          width='44'
          height='44'
          viewBox='0 0 24 24'
          strokeWidth={
            auth.isAuthenticated
              ? viewlist.r_list
                  .filter((re) => re._id === randomEntry._id)[0]
                  .likes.filter((like) => like.user === auth.user._id).length >
                0
                ? '2.5'
                : '1.5'
              : '1.5'
          }
          stroke='#E02F2F'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' />
          <path d='M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7' />
        </svg>
        <div className='rs-like-count'>
          {viewlist.r_list.filter((re) => re._id === randomEntry._id)[0].likes
            .length > 0 &&
            viewlist.r_list.filter((re) => re._id === randomEntry._id)[0].likes
              .length}
        </div>
      </div>
    </Fragment>
  );
};

PublicRecShow.propTypes = {
  reclist: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike })(PublicRecShow);

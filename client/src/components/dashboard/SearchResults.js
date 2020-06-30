import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fragment } from 'react';
import { clearSearchResults } from '../../actions/search';
import { addToReclist } from '../../actions/reclist';
import { GName } from '../../utils/GenreArray';
import { LName } from '../../utils/LangArray';
import moment from 'moment';
import RedAddIcon from '../assets/Icons/RedAddIcon.svg';
import Spinner from '../layout/Spinner';
import NoPosterFound from '../assets/NoPosterFound.png';

const SearchResults = ({
  clearSearchResults,
  search: { results, loading, error },
  addToReclist,
}) => {
  const onClick = (e) => clearSearchResults();
  const onClickAdd = (media_type, id) => addToReclist(media_type, id);
  if (
    !loading &&
    results === null &&
    Object.keys(error).length === 0 &&
    error.constructor === Object
  ) {
    return <Fragment></Fragment>;
  } else if (loading) {
    return (
      <div className='search-res-spinner'>
        <Spinner />
      </div>
    );
  } else if (results !== null) {
    const search_results = results.map(
      (sres) =>
        sres.media_type !== 'person' && (
          <div className='search-entry' key={sres.id}>
            <img
              src={`https://image.tmdb.org/t/p/w154/${sres.poster_path}`}
              alt='Movie Poster'
              className='rl-poster'
              onError={(e) => {
                e.target.onError = null;
                e.target.src = NoPosterFound;
              }}
            />
            <div className='s-greybox'>
              <div className='rl-title s-title'>
                {sres.media_type === 'movie' ? sres.title : sres.name}
              </div>
              <div className='rl-details s-details'>
                &#128970; {sres.vote_average} | {LName[sres.original_language]}{' '}
                |{' '}
                {sres.media_type === 'movie'
                  ? sres.genre_ids.map((gid) => GName.movie[gid]).join(', ')
                  : sres.genre_ids.map((gid) => GName.tv[gid]).join(', ')}{' '}
                |{' '}
                {moment(
                  sres.media_type === 'movie'
                    ? sres.release_date
                    : sres.first_air_date,
                  'YYYY-MM-DD'
                ).format('DD MMM YYYY')}
              </div>
            </div>
            <div className='s-utility'>
              <img
                className='s-add-icon'
                src={RedAddIcon}
                alt='Add to list'
                onClick={() => onClickAdd(sres.media_type, sres.id)}
              />
            </div>
          </div>
        )
    );
    return (
      <Fragment>
        <div className='clear-res' onClick={onClick}>
          Clear Results
        </div>
        {search_results}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <div className='clear-res' onClick={onClick}>
          Clear Results
        </div>
        <div className='search-entry'>
          <div className='s-greybox no-results'>
            <div className='rl-title s-title no-results-title'>
              No Results Found
            </div>
            <div className='rl-details s-details no-results-details'>
              Please try another search query
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
};

SearchResults.propTypes = {
  search: PropTypes.object.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  addToReclist: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  search: state.search,
});

export default connect(mapStateToProps, { clearSearchResults, addToReclist })(
  SearchResults
);

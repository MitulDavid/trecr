import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { getSearchResult } from '../../actions/search';
import SearchIcon from '../assets/Icons/SearchIcon.svg';

const SearchEntry = ({ getSearchResult }) => {
  const [formData, setFormData] = useState({
    query: '',
  });
  const { query } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (query) {
      getSearchResult(query);
    } else {
      toast.error('Search query cannot be empty');
    }
  };

  return (
    <Fragment>
      <div className='search-title'>
        Add to your list<sup className='plus-icon'>+</sup>
      </div>
      <div className='search-subtitle'>
        search for movies or shows and add them to your list
      </div>
      <form onSubmit={onSubmit} className='search-form'>
        <input
          type='text'
          name='query'
          required={true}
          placeholder='Search'
          value={query}
          onChange={(e) => onChange(e)}
        />
        <span className='search-btn' onClick={(e) => onSubmit(e)}>
          <img src={SearchIcon} alt='Search' />
        </span>
      </form>
    </Fragment>
  );
};

SearchEntry.propTypes = {
  getSearchResult: PropTypes.func.isRequired,
};

export default connect(null, { getSearchResult })(SearchEntry);

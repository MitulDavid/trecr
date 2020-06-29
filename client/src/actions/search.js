import axios from 'axios';
import { toast } from 'react-toastify';
import {
  SEARCH_ACTIVE,
  GET_SEARCH_RES,
  SEARCH_ERROR,
  CLEAR_SEARCH_RES,
} from './types';

//Get search results
export const getSearchResult = (query) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ query });
  try {
    dispatch({
      type: SEARCH_ACTIVE,
    });
    const res = await axios.post('api/search', body, config);
    dispatch({
      type: GET_SEARCH_RES,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg);
      });
    }
    dispatch({
      type: SEARCH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear Search Results
export const clearSearchResults = () => (dispatch) => {
  dispatch({ type: CLEAR_SEARCH_RES });
};

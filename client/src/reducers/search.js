import {
  SEARCH_ACTIVE,
  GET_SEARCH_RES,
  SEARCH_ERROR,
  CLEAR_RECLIST,
  CLEAR_SEARCH_RES,
} from '../actions/types';

const initialState = {
  results: null,
  loading: false,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_ACTIVE:
      return {
        ...state,
        loading: true,
      };
    case GET_SEARCH_RES:
      return {
        ...state,
        results: payload,
        loading: false,
        error: {},
      };
    case SEARCH_ERROR:
      return {
        ...state,
        results: null,
        error: payload,
        loading: false,
      };
    case CLEAR_SEARCH_RES:
      return {
        ...state,
        results: null,
        loading: false,
        error: {},
      };
    default:
      return state;
  }
}

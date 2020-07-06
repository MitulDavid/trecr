import {
  GET_PINNEDLIST,
  PINNEDLIST_ERROR,
  CLEAR_PINNEDLIST,
} from '../actions/types';

const initialState = {
  pinnedlist: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PINNEDLIST:
      return {
        ...state,
        pinnedlist: payload,
        loading: false,
      };
    case PINNEDLIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PINNEDLIST:
      return {
        ...state,
        pinnedlist: null,
        loading: false,
        error: {},
      };
    default:
      return state;
  }
}

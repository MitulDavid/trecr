import { GET_RECLIST, RECLIST_ERROR, CLEAR_RECLIST } from '../actions/types';

const initialState = {
  reclist: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_RECLIST:
      return {
        ...state,
        reclist: payload,
        loading: false,
      };
    case RECLIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_RECLIST:
      return {
        ...state,
        reclist: null,
        error: null,
        loading: false,
      };
    default:
      return state;
  }
}

import {
  GET_RECLIST,
  GET_VIEWLIST,
  RECLIST_ERROR,
  CLEAR_RECLIST,
  UPDATE_LIKES,
} from '../actions/types';

const initialState = {
  reclist: null,
  viewlist: null,
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
    case GET_VIEWLIST:
      return {
        ...state,
        viewlist: payload,
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
    case UPDATE_LIKES:
      return {
        ...state,
        viewlist: {
          ...state.viewlist,
          r_list: state.viewlist.r_list.map((r_entry) =>
            r_entry._id === payload.entry_id
              ? { ...r_entry, likes: payload.likes }
              : r_entry
          ),
        },
        loading: false,
      };
    default:
      return state;
  }
}

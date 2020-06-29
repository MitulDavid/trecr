import axios from 'axios';
import { GET_RECLIST, RECLIST_ERROR } from './types';

//Get current user's reclist
export const getCurrentReclist = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/reclist/me');
    dispatch({
      type: GET_RECLIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RECLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

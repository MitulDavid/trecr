import axios from 'axios';
import { GET_PINNEDLIST, PINNEDLIST_ERROR } from './types';

import { toast } from 'react-toastify';

//Get current user's reclist
export const getPinnedList = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/pinnedlist/me');
    dispatch({
      type: GET_PINNEDLIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PINNEDLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Pin a list
export const pinList = (user_id) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/pinnedlist/${user_id}`);

    toast.success('This list has been added to your pinned lists section');
    dispatch({
      type: GET_PINNEDLIST,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err);
    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg);
      });
    }
    dispatch({
      type: PINNEDLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Unpin a list
export const unpinList = (user_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/pinnedlist/${user_id}`);
    dispatch({
      type: GET_PINNEDLIST,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err);
    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg);
      });
    }
    dispatch({
      type: PINNEDLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

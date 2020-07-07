import axios from 'axios';
import {
  GET_RECLIST,
  GET_VIEWLIST,
  RECLIST_ERROR,
  UPDATE_LIKES,
  VIEWLIST_CLENSE,
} from './types';
import { toast } from 'react-toastify';

//Get current user's reclist
export const getCurrentReclist = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/reclist/me');
    dispatch({
      type: GET_RECLIST,
      payload: res.data,
    });
  } catch (err) {
    //@todo: decide if errors should be displayed if not remove commented code
    // const errors = err.response.data.errors;
    // console.log(err);
    // if (errors) {
    //   errors.forEach((error) => {
    //     toast.error(error.msg);
    //   });
    // }
    dispatch({
      type: RECLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add an entry to your reclist
export const addToReclist = (mediaType, id) => async (dispatch) => {
  try {
    toast.info('Adding entry...', { toastId: 'addingentry', autoClose: 5000 });
    const res = await axios.post(`/api/reclist/${mediaType}/${id}`);
    toast.isActive('addingentry')
      ? toast.update('addingentry', {
          type: toast.TYPE.SUCCESS,
          autoClose: 5000,
          render: 'Entry added to your list',
        })
      : toast.success('Entry added to your list');
    dispatch({
      type: GET_RECLIST,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err);
    if (errors) {
      errors.forEach((error) => {
        toast.isActive('addingentry')
          ? toast.update('addingentry', {
              type: toast.TYPE.ERROR,
              autoClose: 5000,
              render: error.msg,
            })
          : toast.error(error.msg);
      });
    }
    dispatch({
      type: RECLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Remove an entry from reclist
export const removeRecEntry = (r_item_id) => async (dispatch) => {
  try {
    toast.info('Removing entry...', {
      toastId: 'removingentry',
      autoClose: 1500,
    });
    const res = await axios.delete(`api/reclist/item/${r_item_id}`);
    // toast.dismiss('removingentry');
    dispatch({
      type: GET_RECLIST,
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
      type: RECLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get a user's reclist by username
export const getReclistByUsername = (username) => async (dispatch) => {
  try {
    //@temporary-fix
    dispatch({
      type: VIEWLIST_CLENSE,
    });
    const res = await axios.get(`/api/reclist/${username}`);
    dispatch({
      type: GET_VIEWLIST,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err);
    // if (errors) {
    //   errors.forEach((error) => {
    //     toast.error(error.msg);
    //   });
    // }
    if (errors) {
      dispatch({
        type: RECLIST_ERROR,
        payload: { msg: errors[0].msg, status: err.response.status },
      });
    } else {
      dispatch({
        type: RECLIST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Like reclist entry
export const addLike = (reclist_id, entry_id) => async (dispatch) => {
  try {
    const res = await axios.put(`api/reclist/like/${reclist_id}/${entry_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { reclist_id, entry_id, likes: res.data },
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg);
      });
    }
    dispatch({
      type: RECLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Unlike reclist entry
export const removeLike = (reclist_id, entry_id) => async (dispatch) => {
  try {
    const res = await axios.put(`api/reclist/unlike/${reclist_id}/${entry_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { reclist_id, entry_id, likes: res.data },
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        toast.error(error.msg);
      });
    }
    dispatch({
      type: RECLIST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

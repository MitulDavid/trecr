import axios from 'axios';
import { GET_RECLIST, RECLIST_ERROR } from './types';
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

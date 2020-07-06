import { combineReducers } from 'redux';
import auth from './auth';
import reclist from './reclist';
import search from './search';
import pinnedlist from './pinnedlist';

export default combineReducers({
  auth,
  reclist,
  search,
  pinnedlist,
});

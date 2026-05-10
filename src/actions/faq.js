import axios from 'axios';
import {
  FAQ_FETCH_REQUEST,
  FAQ_FETCH_SUCCESS,
  FAQ_FETCH_FAILURE,
} from '../constants/actionTypes.js';

export const fetchFAQ = () => {
  return (dispatch) => {
    dispatch({ type: FAQ_FETCH_REQUEST });

    axios
      .get('/api/content/faq')
      .then((response) =>
        dispatch({
          type: FAQ_FETCH_SUCCESS,
          payload: response.data,
        }),
      )
      .catch((error) =>
        dispatch({
          type: FAQ_FETCH_FAILURE,
          payload: error,
        }),
      );
  };
};

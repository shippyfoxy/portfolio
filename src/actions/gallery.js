import axios from 'axios';
import {
  GALLERY_FETCH_SUCCESS,
  GALLERY_FETCH_FAILURE,
  GALLERY_CLICK,
  GALLERY_MODAL_OPEN,
} from '../constants/actionTypes.js';

export const fetchGallery = () => {
  return (dispatch) => {
    dispatch({ type: 'GALLERY_FETCH_REQUEST' });

    axios
      .get('/api/content/galleryy')
      .then((response) => {
        console.log(response);
        return dispatch({
          type: GALLERY_FETCH_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) =>
        dispatch({
          type: GALLERY_FETCH_FAILURE,
          payload: error,
        }),
      );
  };
};

export const click = (id) => {
  return (dispatch, getState) => {
    dispatch({
      type: GALLERY_CLICK,
      payload: {
        // open modal if prev target id does not match
        // if it matches then reverse the boolean value of modalOpen
        //open: getState().modalTargetId === id ? !getState().modalOpen : true,
        // set to the most recently clicked project id
        id: id,
      },
    });
  };
};

export const closeModal = () => ({
  type: GALLERY_MODAL_OPEN,
  payload: false,
});

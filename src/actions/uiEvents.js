import { UI_GOOGLE_READY } from '../constants/actionTypes.js';

export const googleReady = (isReady) => {
  return (dispatch) => {
    dispatch({
      type: UI_GOOGLE_READY,
      payload: isReady,
    });
  };
};

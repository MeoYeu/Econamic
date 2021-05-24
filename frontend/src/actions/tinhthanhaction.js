import {FETCH_TINHTHANH,FETCH_TINHTHANH_SUCCESS,FETCH_TINHTHANH_ERROR} from '../constants/tinhthanhConstant';
import Axios from 'axios';

export const fetchtinhthanh = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_TINHTHANH });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(
      '/api/tinhthanh',
      
    );
    console.log('tình thành',data);
    dispatch({
      type: FETCH_TINHTHANH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: FETCH_TINHTHANH_ERROR, payload: message });
  }
};

import {FETCH_TINHTHANH_SUCCESS,FETCH_TINHTHANH_ERROR,FETCH_TINHTHANH} from '../constants/tinhthanhConstant'

export const tinhthanhReducer = (
  state = { loading: true, tentinh: [],success:false },
  action
) => {
  switch (action.type) {
    case FETCH_TINHTHANH:
      return { loading: true };
    case FETCH_TINHTHANH_SUCCESS:
      console.log("action",action.payload);
      return {
        loading: false,
        tentinh: action.payload,
        page: action.payload.page,
        pages: action.payload.pages,
        success:true
    
        
      };
    case FETCH_TINHTHANH_ERROR:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
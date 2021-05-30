import { CREATE_MESSAGE_FAIL, CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_SUCCESS } from "../constants/messageConstant";
import Axios from 'axios';
export const createMessages = (text,sender,conversationId) => async (dispatch) => {
    dispatch({ type: CREATE_MESSAGE_REQUEST, payload: { sender  } });
    console.log("nội dung",text,sender);
    try {
      const { data } = await Axios.post('/api/message', {
        text,
        sender,
        conversationId
      });
      console.log("kết quá",data);
      dispatch({ type: CREATE_MESSAGE_SUCCESS, payload: data });
    
    } catch (error) {
      dispatch({
        type: CREATE_MESSAGE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
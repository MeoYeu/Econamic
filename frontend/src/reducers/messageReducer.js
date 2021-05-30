import { CREATE_MESSAGE_REQUEST,CREATE_MESSAGE_SUCCESS,CREATE_MESSAGE_FAIL } from "../constants/messageConstant";

export const messageCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case CREATE_MESSAGE_REQUEST:
        return { loading: true };
      case CREATE_MESSAGE_SUCCESS:
        return { loading: false, success: true, messages: action.payload };
      case CREATE_MESSAGE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
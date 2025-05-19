import {
  GET_VIDEO_FAIL,
  GET_VIDEO_REQUEST,
  GET_VIDEO_SUCCESS,
} from "../constant/videoConstant";

export const VideoReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_VIDEO_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_VIDEO_SUCCESS:
      return {
        ...state,
        loading: false,
        myvideos: action.payload,
      };

    case GET_VIDEO_FAIL:
      return {
        ...state,
        loading: false,

        error: action.payload,
      };

    default:
      return state;
  }
};

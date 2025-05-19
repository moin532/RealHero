import {
  GET_VIDEO_FAIL,
  GET_VIDEO_REQUEST,
  GET_VIDEO_SUCCESS,
} from "../constant/videoConstant";
import { url } from "../../src/store";
import axios from "axios";
export const GetVideosAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_VIDEO_REQUEST });

    const { data } = await axios.get(`${url}/api/v1/video/all`);

    dispatch({
      type: GET_VIDEO_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: GET_VIDEO_FAIL,
      payload: error.response.data.message,
    });
  }
};

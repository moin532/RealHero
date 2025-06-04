import {
  USER_REG_REQUEST,
  USER_REG_SUCCESS,
  USER_REG_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
} from "../constant/UserConstant";
import axios from "axios";
import { url } from "../../src/store";
import Cookies from "js-cookie";

export const RegisterUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REG_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      `${url}/api/v1/register`,
      userData,
      config
    );

    Cookies.set("Token", JSON.stringify(data.Token), {
      expires: 7,
      path: "/",
    });

    dispatch({
      type: USER_REG_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_REG_FAIL,
      payload: error.response.data.message || error.response.data.msg,
    });
  }
};

export const LoginUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(`${url}/api/v1/login`, userData, config);

    Cookies.set("Token", JSON.stringify(data.Token), {
      expires: 7,
      path: "/",
    });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response.data.content,
    });
  }
};

const token = Cookies.get("Token") ? JSON.parse(Cookies.get("Token")) : null;

export const loadUserAction = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get(`${url}/api/v1/me`, {
      headers: {
        authorization: `${token}`,
      },
    });

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error?.response?.data?.message,
    });
  }
};

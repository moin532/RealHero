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
  USER_LOGIN_RESET,
} from "../constant/UserConstant";

export const UserReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_REG_REQUEST:
    case USER_LOGIN_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
      };

    case USER_REG_SUCCESS:
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload, // ✅ You missed setting user here
      };

    case USER_REG_FAIL:
    case USER_LOGIN_FAIL:
    case LOAD_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case USER_LOGIN_RESET:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
        isuser: null,
      };

    default:
      return state;
  }
};

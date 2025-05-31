
import { useReducer } from "react";

export const AUTH_ACTIONS = {
  REGISTER_REQUEST: "REGISTER_REQUEST",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGIN_REQUEST: "LOGIN_REQUEST", // Added
  LOGIN_SUCCESS: "LOGIN_SUCCESS", // Added
  LOGIN_FAILURE: "LOGIN_FAILURE",
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",

  CLEAR_ERROR: "CLEAR_ERROR",
};

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.REGISTER_REQUEST:
    case AUTH_ACTIONS.LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };
    case AUTH_ACTIONS.REGISTER_SUCCESS:
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        error: null,
      };
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload.error };
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload.user };
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, isLoading: false, user: null };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const useAuthReducer = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return { state, dispatch };
};

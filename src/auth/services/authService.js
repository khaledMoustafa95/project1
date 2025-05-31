// src/services/authService.js
import { supabase } from "./supabaseClient";
import { AUTH_ACTIONS } from "../hooks/useAuthReducer";

export const registerUser = async (dispatch, { email, password }) => {
  dispatch({ type: AUTH_ACTIONS.REGISTER_REQUEST });
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      // Handle Supabase specific errors if needed
      if (error.message.includes("User already registered")) {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: {
            error: "This email is already registered. Please try logging in.",
          },
        });
      } else {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: {
            error: error.message || "Registration failed. Please try again.",
          },
        });
      }
      console.error("Supabase registration error:", error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Supabase sends a confirmation email by default.
      // The user object might be immediately available, or after confirmation,
      // depending on your Supabase auth settings.
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user: data.user },
      });
      // You might want to inform the user to check their email for confirmation
      // if your Supabase project settings require email confirmation.
      alert(
        "Registration successful! Please check your email to confirm your account if required by the application settings."
      );
      return { success: true, user: data.user };
    } else if (data.session === null && !data.user) {
      // This case can happen if email confirmation is required and the user is not yet confirmed.
      // Supabase returns user: null and session: null in this scenario for signUp.
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS, // Still a "success" in terms of API call
        payload: { user: null }, // User is null until confirmed
      });
      alert(
        "Registration initiated! Please check your email to confirm your account."
      );
      return { success: true, user: null, requiresConfirmation: true };
    } else {
      // Fallback for unexpected response structure
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: "An unexpected error occurred during registration." },
      });
      return { success: false, error: "An unexpected error occurred." };
    }
  } catch (err) {
    console.error("Registration catch error:", err);
    dispatch({
      type: AUTH_ACTIONS.REGISTER_FAILURE,
      payload: { error: err.message || "An unexpected error occurred." },
    });
    return { success: false, error: err.message };
  }
};
export const loginUser = async (dispatch, { email, password }) => {
  dispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: {
          error:
            error.message || "Login failed. Please check your credentials.",
        },
      });
      console.error("Supabase login error:", error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: data.user },
      });
      return { success: true, user: data.user };
    } else {
      // Should not happen if error is not present, but good to have a fallback
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: "Login failed. No user data received." },
      });
      return { success: false, error: "Login failed. No user data received." };
    }
  } catch (err) {
    console.error("Login catch error:", err);
    dispatch({
      type: AUTH_ACTIONS.LOGIN_FAILURE,
      payload: {
        error: err.message || "An unexpected error occurred during login.",
      },
    });
    return { success: false, error: err.message };
  }
};

export const logoutUser = async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.LOGOUT });
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Supabase logout error:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
};

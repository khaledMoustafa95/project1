// src/auth/components/AuthStateInitializer.jsx
import React, { useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient"; // Adjust path to your supabaseClient
import { useAuth } from "../context/AuthContext"; // Adjust path to your AuthContext
import { AUTH_ACTIONS } from "../hooks/useAuthReducer"; // Adjust path to your useAuthReducer

const AuthStateInitializer = ({ children }) => {
  const { authDispatch } = useAuth();
  const isMounted = useRef(false);  
  useEffect(() => {
    isMounted.current = true;

    if (isMounted.current) {
      authDispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST }); // Or a more generic PENDING/LOADING action
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (isMounted.current) {
          if (session) {
            authDispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS, // Or SET_USER
              payload: { user: session.user },
            });
          } else {
            // If no session, ensure user is null and loading is complete for "no user" state
            authDispatch({ type: AUTH_ACTIONS.LOGOUT }); // LOGOUT action usually sets user to null and loading to false
          }
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          console.error("Error getting initial session:", error);
          authDispatch({
            type: AUTH_ACTIONS.LOGIN_FAILURE,
            payload: { error: "Error initializing auth state." },
          });
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted.current) return;

        console.log(`Supabase auth event: ${event}`, session);
        switch (event) {
          case "INITIAL_SESSION":
            if (session) {
              authDispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS, // Or SET_USER
                payload: { user: session.user },
              });
            } else {
              // This case handles when there's no initial session.
              // The getSession() call above might handle this, but onAuthStateChange also provides it.
              authDispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
            break;
          case "SIGNED_IN":
            authDispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: session.user },
            });
            break;
          case "SIGNED_OUT":
            authDispatch({ type: AUTH_ACTIONS.LOGOUT });
            break;
          case "PASSWORD_RECOVERY":
            // Handle password recovery state if needed
            // For now, just ensures loading is false
            authDispatch({ type: AUTH_ACTIONS.LOGOUT }); // Clears user, sets loading false
            break;
          case "TOKEN_REFRESHED":
            // Supabase handles token refresh automatically.
            // You might want to update the user object if it changed, though typically not necessary for just a token refresh.
            if (session) {
              authDispatch({
                type: AUTH_ACTIONS.SET_USER, // Use SET_USER to avoid resetting isLoading if already logged in
                payload: { user: session.user },
              });
            }
            break;
          case "USER_UPDATED":
            if (session) {
              authDispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: { user: session.user },
              });
            }
            break;
          default:
            // If no specific event or session, ensure loading is false
            // This could be a fallback, but getSession and INITIAL_SESSION should cover most initial states
            if (!session && authDispatch) {
              // Check authDispatch to ensure it's available
              // authDispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
            break;
        }
      }
    );

  
    return () => {
      isMounted.current = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [authDispatch]); 

 
  return <>{children}</>;
};

export default AuthStateInitializer;

import { createContext, useContext } from "react";
import {useAuthReducer} from "../hooks/useAuthReducer";

const AuthContext = createContext();




export function AuthProvider({ children }) {
   const { state, dispatch } = useAuthReducer();
  return (
    <AuthContext.Provider value={{authState: state,authDispatch: dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
/* @ts-ignore */

import React from "react";

export const AuthContext = React.createContext<any>(null);

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SIGN_IN":
      window.sessionStorage.setItem("jwtToken", action.payload);
      return { ...state, jwtToken: action.payload };
    case "SIGN_OUT":
      window.sessionStorage.removeItem("jwtToken");
      return { ...state, jwtToken: "" };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    jwtToken: window.sessionStorage.getItem("jwtToken") || ""
  });
  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

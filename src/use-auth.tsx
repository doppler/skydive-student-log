/* @ts-ignore */

import React, { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

const useProvideAuth = () => {
  const history = useHistory();
  const [token, setToken] = useState("");
  const signin = (email: string, password: string) => {
    return axios
      .post("/graphql", {
        query: `mutation {
          signinInstructor(
            input: {email: "${email}", password: "${password}"}
          ) { jwtToken }
        }`
      })
      .then(response => {
        const jwtToken = response.data.data.signinInstructor.jwtToken;
        setToken(jwtToken);
        window.sessionStorage.setItem("jwtToken", jwtToken);
        return response.data.data;
      });
  };

  const signout = () => {
    window.sessionStorage.removeItem("jwtToken");
    setToken("");
    history.push("/");
  };

  useEffect(() => {
    const jwtToken = window.sessionStorage.getItem("jwtToken") || "";
    setToken(jwtToken);
  }, []);

  return { signin, signout, token };
};
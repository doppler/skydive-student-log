import React, { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

const useProvideAuth = () => {
  const history = useHistory();
  const [token, setToken] = useState(
    window.sessionStorage.getItem("jwtToken") || ""
  );

  const [user, setUser] = useState();

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
    setUser(null);
    history.push("/");
  };

  useEffect(() => {
    if (token) {
      const { name, role, instructorId } = jwtDecode(token);
      const user = { name, role, instructorId };
      setUser(user);
      console.log(user);
    }
  }, [token]);
  return { signin, signout, token, user };
};

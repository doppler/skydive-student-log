import React, { useContext, useEffect } from "react";
import AuthContext from "../AuthContext";
import { useAsyncFunction, sendGrapQLMutation } from "../graphql-utils";
const Login: React.FC = () => {
  const [login, setLogin] = React.useState({
    email: "doppler@gmail.com",
    password: "password"
  });
  const [res, signinInstructor] = useAsyncFunction(sendGrapQLMutation);
  const [state, dispatch] = useContext(AuthContext);
  const { jwtToken } = state;
  console.log({ jwtToken });
  const [signedIn, setSignedIn] = React.useState(jwtToken !== "");
  const changeInputValue = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setLogin(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  type Login = {
    email: string;
    password: string;
  };

  const signinIntructorQuery = (login: Login) => {
    return `mutation MyMutation {
      __typename
      signinInstructor(input: {email: "${login.email}", password: "${login.password}"}) {
        jwtToken
      }
    }`;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signinInstructor(signinIntructorQuery(login));
  };

  useEffect(() => {
    const { data } = res;
    if (!signedIn && data && data.signinInstructor) {
      dispatch({ type: "SIGN_IN", payload: data.signinInstructor.jwtToken });
      setSignedIn(true);
    }
  }, [res, signedIn, dispatch]);

  const StatusDisplay = () =>
    res.loading ? (
      <div>Logging in...</div>
    ) : res.error ? (
      <div>
        <code>{res.error}</code>
      </div>
    ) : res.complete ? (
      <code>{JSON.stringify(res.data, null, 2)}</code>
    ) : (
      <div>huh</div>
    );

  const signOut = () => {
    dispatch({ type: "SIGN_OUT" });
    setSignedIn(false);
  };

  return signedIn ? (
    <button onClick={signOut}>Sign out</button>
  ) : (
    <form onSubmit={onSubmit}>
      <input
        onChange={changeInputValue}
        value={login.email}
        name="email"
        autoComplete="off"
        placeholder="email address"
        required
      />
      <input
        onChange={changeInputValue}
        value={login.password}
        name="password"
        type="password"
        placeholder="password"
        required
      />
      <button type="submit">Log in</button>
    </form>
  );
};

export default Login;

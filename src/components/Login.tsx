import React from "react";
import { useAuth } from "../use-auth";

const Login: React.FC = () => {
  const [login, setLogin] = React.useState({
    email: "doppler@gmail.com",
    password: "password"
  });
  const { token, signin, signout } = useAuth();

  const changeInputValue = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setLogin(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signin(login.email, login.password);
  };

  return token ? (
    <button onClick={signout}>Sign out</button>
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

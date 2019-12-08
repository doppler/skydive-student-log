import React from "react";
import { useAsyncFunction, sendGrapQLMutation } from "../graphql-utils";
const Login: React.FC = () => {
  const [login, setLogin] = React.useState({ email: "", password: "" });
  const [res, signinInstructor] = useAsyncFunction(sendGrapQLMutation);

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

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          onChange={changeInputValue}
          name="email"
          autoComplete="off"
          placeholder="email address"
          required
        />
      </div>
      <div>
        <input
          onChange={changeInputValue}
          name="password"
          type="password"
          placeholder="password"
          required
        />
      </div>
      <div>
        <button type="submit">Log in</button>
      </div>
      <code>{JSON.stringify(login, null, 2)}</code>
      <StatusDisplay />
    </form>
  );
};

export default Login;

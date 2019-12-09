import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { useAuth, AuthProvider } from "./use-auth";
import StudentRouter from "./components/StudentRouter";
import Login from "./components/Login";

import "./App.css";

const App: React.FC = () => {
  // const jwtToken = window.sessionStorage.getItem("jwtToken");
  // const [jwtToken, setJwtToken] = React.useState("");
  // useEffect(() => {
  //   setJwtToken(window.sessionStorage.getItem("jwtToken") || "");
  // }, [jwtToken]);
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Switch>
          <PrivateRoute path="/students">
            <StudentRouter />
          </PrivateRoute>
          <PrivateRoute path="/settings">
            <Settings />
          </PrivateRoute>
          <PrivateRoute path="/instructors">
            <Instructors />
          </PrivateRoute>
          <PrivateRoute path="/aircraft">
            <Aircraft />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
};

const fakeAuth = {
  isAuthenticated: window.sessionStorage.getItem("jwtToken")
};

interface IPrivateRouteProps {
  children: React.ReactNode;
  path: string;
}

const PrivateRoute = ({ children, ...rest }: IPrivateRouteProps) => {
  return (
    <Route
      {...rest}
      render={({ location }: any) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

const Home: React.FC = () => {
  const { token } = useAuth();
  return token ? (
    <div>
      <div>
        <Link to="/students">Students</Link>
      </div>
      <div>
        <Link to="/instructors">Instructors</Link>
      </div>
      <div>
        <Link to="/aircraft">Aircraft</Link>
      </div>
      <div>
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  ) : null;
};
const Header: React.FC = () => {
  const { token } = useAuth();
  return (
    <div>
      <Login />
    </div>
  );
};

const Instructors: React.FC = () => <div>Instructors</div>;

const Aircraft: React.FC = () => <div>Aircraft</div>;

const Settings: React.FC = () => <div>Settings</div>;

export default App;

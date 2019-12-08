import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import StudentRouter from "./components/StudentRouter";
import Login from "./components/Login";

import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/students">
          <StudentRouter />
        </Route>
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
    </Router>
  );
};

const fakeAuth = {
  isAuthenticated: false
};

interface IPrivateRouteProps {
  children: ReactNode;
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
const Home: React.FC = () => (
  <div>
    <Link to="/">Home</Link>
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
);

const Instructors: React.FC = () => <div>Instructors</div>;

const Aircraft: React.FC = () => <div>Aircraft</div>;

const Settings: React.FC = () => <div>Settings</div>;

export default App;

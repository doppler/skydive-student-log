import React from "react";
import ListStudents from "./ListStudents";
import ShowStudent from "./ShowStudent";

import { Route, Switch, useRouteMatch } from "react-router-dom";

const StudentRouter: React.FC = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:studentId`}>
        <ShowStudent />
      </Route>
      <Route path={`${match.path}`}>
        <ListStudents />
      </Route>
    </Switch>
  );
};
export default StudentRouter;

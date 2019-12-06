import React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useGraphQLQuery } from "../graphql-utils"

const fetchStudentAndJumpsQuery = (id: number) => `
  query fetchStudentQuery {
    __typename
    student(id: ${id}) {
      id
      email
      hometown
      name
      phone
      uspaLicense
      uspaNumber
      jumps(orderBy: CREATED_AT_DESC) {
        nodes {
          createdAt
          deploymentAltitude
          exitAltitude
          logEntry
          aircraft {
            name
          }
          instructor {
            name
          }
          location {
            name
          }
        }
      }
    }
  }`;

const ShowStudent: React.FC = () => {
  const match = useRouteMatch();
  const { params } = useRouteMatch();
  const history = useHistory();
  const { loading, error, data } = useGraphQLQuery(
    fetchStudentAndJumpsQuery(params.studentId)
  );
  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return (
      <div>
        Error!<code>{JSON.stringify(error, null, 2)}</code>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => history.push(`${match.url}/edit`)}>Edit Student</button>
      <code>{JSON.stringify(data, null, 2)}</code>
    </div>
  );
};

export default ShowStudent;

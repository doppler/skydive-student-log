import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useQuery } from "graphql-hooks";

const fetchStudentQuery = (id: number) => `
  query fetchStudentQuery {
    __typename
    student(id: ${id}) {
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
  const { params } = useRouteMatch();
  const { loading, error, data } = useQuery(
    fetchStudentQuery(params.studentId)
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
      <code>{JSON.stringify(data, null, 2)}</code>
    </div>
  );
};

export default ShowStudent;

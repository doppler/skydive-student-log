import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useGraphQLQuery } from "../graphql-utils";

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
          id
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

  const [student, setStudent] = useState({});
  useEffect(() => {
    if (data && data.student && data.student.id) {
      data.student.jumps = data.student.jumps.nodes;
      setStudent(data.student);
    }
  }, [data, student]);

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
      <button onClick={() => history.push(`${match.url}/edit`)}>
        Edit Student
      </button>
      <code>{JSON.stringify(student, null, 2)}</code>
    </div>
  );
};

export default ShowStudent;

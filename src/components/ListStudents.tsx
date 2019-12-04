import React from "react";
import { useQuery } from "graphql-hooks";
import { useHistory, useRouteMatch } from "react-router-dom";

type Student = {
  id: number;
  name: string;
  email: string;
  hometown: string;
  phone: string;
  uspaNumber?: number;
  uspaLicense?: string;
};

const ALL_STUDENTS = `query MyQuery {
  students {
    nodes {
      id
      name
      email
      hometown
      phone
      uspaLicense
      uspaNumber
    }
  }
}`;

const ListStudents: React.FC = () => {
  const { loading, error, data } = useQuery(ALL_STUDENTS);
  const history = useHistory();
  const match = useRouteMatch();

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  return (
    <div>
      <button onClick={() => history.push(`${match.path}/new`)}>Add Student</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.students.nodes.map((student: Student) => (
            <tr
              key={student.id}
              onClick={() => history.push(`/students/${student.id}`)}
            >
              <td>{student.name}</td>
              <td>{student.phone}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListStudents;

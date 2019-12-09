import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import {
  useGraphQLQuery,
  getIdFromResult,
  useGraphQLMutation
} from "../graphql-utils";

export interface IStudent {
  id?: number;
  name: string;
  email: string;
  phone: string;
  hometown: string;
  uspaLicense?: string;
  uspaNumber?: number | null;
}

const newStudentData: IStudent = {
  name: "",
  email: "",
  phone: "",
  hometown: "",
  uspaNumber: null
};

const fetchStudetQuery = (id: number) => `
  query fetchStudentQuery {
    __typename
    student(id: ${id}) {
      id
      name
      email
      phone
      hometown
      uspaLicense
      uspaNumber
    }
  }`;

const createStudentQuery = (student: any) => {
  const queryValues = Object.keys(student)
    .map((key: string) => {
      return `${key}: ${JSON.stringify(student[key])}`;
    })
    .join(", ");
  return `mutation {
    __typename
    createStudent(
      input: {
        student: {
          ${queryValues}
        }
      }) {
        student { id }
      }
    }`;
};

const updateStudentQuery = (student: any): string => {
  const { id } = student;
  const queryValues = Object.keys(student)
    .filter(key => key !== "id")
    .map((key: any) => {
      return `${key}: ${JSON.stringify(student[key])}`;
    })
    .join(", ");
  return `mutation {
    __typename
    updateStudent(
      input: {
        patch: {
          ${queryValues}
        }, 
      id: ${id}
    }) {
      student { id }
    }
  }`;
};

type StudentProps = {
  student: IStudent;
};

const EditStudentForm: React.FC<StudentProps> = (props: StudentProps) => {
  const [student, setStudent] = useState(props.student);
  // const [res, saveStudentToGraphQLStore] = useAsyncFunction(sendGrapQLMutation);
  const [res, callApi] = useGraphQLMutation(
    student.id ? updateStudentQuery(student) : createStudentQuery(student)
  );

  const changeInputValue = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setStudent(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const saveStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callApi();
  };

  const StatusDisplay = () =>
    res.loading ? (
      <div>Saving...</div>
    ) : res.error ? (
      <div>
        <code>{res.error}</code>
      </div>
    ) : res.data ? (
      <div>
        <code>{JSON.stringify(res.data)}</code>
      </div>
    ) : (
      <div>...</div>
    );

  // if this was a create, need the id from the mutation result
  if (res.complete && !student.id)
    setStudent(prevState => ({ ...prevState, id: getIdFromResult(res.data) }));

  return (
    <form onSubmit={saveStudent}>
      <div>id: {student.id}</div>
      <div>
        <input
          autoComplete="off"
          onChange={changeInputValue}
          name="name"
          value={student.name}
          placeholder="Full Name"
          required
        />
      </div>
      <div>
        <input
          autoComplete="off"
          onChange={changeInputValue}
          name="email"
          value={student.email}
          placeholder="email@domain.tld"
          required
        />
      </div>
      <div>
        <input
          autoComplete="off"
          onChange={changeInputValue}
          name="phone"
          value={student.phone}
          placeholder="123-456-7890"
          required
        />
      </div>
      <div>
        <input
          autoComplete="off"
          onChange={changeInputValue}
          name="hometown"
          value={student.hometown}
          placeholder="Hometown, ST"
          required
        />
      </div>
      <button type="submit">Save</button>
      <StatusDisplay />
    </form>
  );
};

export const NewStudent: React.FC = () => (
  <EditStudentForm student={newStudentData} />
);

const EditStudent: React.FC = () => {
  const { params } = useRouteMatch();

  const res = useGraphQLQuery(fetchStudetQuery(params.studentId));
  if (res.loading) return <div>Loading...</div>;
  if (res.error) {
    console.error(res.error);
    return (
      <div>
        Error!<code>{JSON.stringify(res.error, null, 2)}</code>
      </div>
    );
  }
  if (res.data && res.data.student) {
    return <EditStudentForm student={res.data.student} />;
  }
  return <code>{JSON.stringify(res, null, 2)}</code>;
};

export default EditStudent;

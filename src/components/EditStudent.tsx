import React from "react"
import { useRouteMatch } from "react-router-dom"
import { useQuery } from "graphql-hooks"

interface IStudent {
  email: string,
  hometown: string,
  name: string,
  phone: string,
  uspaLicense?: string,
  uspaNumber?: number | null
}

const fetchStudetQuery = (id: number) => `
  query fetchStudentQuery {
    __typename
    student(id: ${id}) {
      email
      hometown
      name
      phone
      uspaLicense
      uspaNumber
    }
  }`;

const newStudentData:IStudent = {
    "name": "",
    "email": "",
    "phone": "",
    "hometown": "",
    "uspaNumber": null
}

export const NewStudent: React.FC = () => <EditStudentForm student={newStudentData}/>

const EditStudent: React.FC = () => {
  const { params } = useRouteMatch();

    const { loading, error, data } = useQuery(fetchStudetQuery(params.studentId))
    if (loading) return <div>Loading...</div>;
    if (error) {
      console.error(error);
      return (
        <div>
          Error!<code>{JSON.stringify(error, null, 2)}</code>
        </div>
      );
    }
    return <EditStudentForm student={data.student}/>
}

export default EditStudent;

type StudentProps = {
  student: IStudent
}

const EditStudentForm: React.FC<StudentProps> = (props: StudentProps) => {
  const { student } = props
  return (
    <div>
      <code>{JSON.stringify(student, null, 2)}</code>
    </div>
  ) 
}
import React, { useState } from "react"
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
  const [student, setStudent] = useState(props.student);

  const changeInputValue = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    setStudent(prevState => { return {...prevState, [name]: value} })
  }

  const saveStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitted", student)
  }

  return (
    <form onSubmit={saveStudent}>
      <div>
        <input autoComplete="off" onChange={changeInputValue} name="name" value={student.name} placeholder="Full Name" required />
      </div>
      <div>
        <input autoComplete="off" onChange={changeInputValue} name="email" value={student.email} placeholder="email@domain.tld" required />
      </div>
      <div>
        <input autoComplete="off" onChange={changeInputValue} name="phone" value={student.phone} placeholder="123-456-7890" required />
      </div>
      <div>
        <input autoComplete="off" onChange={changeInputValue} name="hometown" value={student.hometown} placeholder="Hometown, ST" required />
      </div>
      <button type="submit">Save</button>
    </form>
  ) 
}
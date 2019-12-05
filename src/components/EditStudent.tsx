import React, { useState } from "react"
import { useRouteMatch } from "react-router-dom"
// import { useQuery } from "graphql-hooks"
import axios from "axios";

interface IStudent {
  id?: number,
  name: string,
  email: string,
  phone: string,
  hometown: string,
  uspaLicense?: string,
  uspaNumber?: number | null
}

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

const newStudentData:IStudent = {
    "name": "",
    "email": "",
    "phone": "",
    "hometown": "",
    "uspaNumber": null
}

const createStudentQuery = (student: IStudent) => `mutation {
  __typename
  createStudent(
    input: {
      student: {
        name: ${JSON.stringify(student.name)}, 
        email:${JSON.stringify(student.email)}, 
        phone: ${JSON.stringify(student.phone)}, 
        hometown: ${JSON.stringify(student.hometown)}
      }
    }) {
      student { id }
    }
  }`

const updateStudentQuery = (student: any): string => {
  const { id } = student
  const queryValues = Object.keys(student).filter(key => key !== "id").map((key: any) => {
    return `${key}: ${JSON.stringify(student[key])}`
  }).join(", ")
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
  }`
} 

type UseGraphQLFetchValue = {
  loading: boolean,
  error: null | {}
  data: null | {student:IStudent}
}

const useGraphQLFetch = (query: string) => {
  const [res, setRes] = useState<UseGraphQLFetchValue>({loading: true, error: null, data: null});
  React.useEffect(() => {
    setRes({loading: true, error: null, data: null});
    axios.post("/graphql", { query }).then(res => {
      setRes({...res.data, error: null, isLoading: false})
    }).catch(error => {
      setRes({data: error , loading: false, error})
    })
  }, [query])
  return res
}

const useGraphQLStore = (action: Function):[UseGraphQLFetchValue, Function] => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const performAction = async (query: string) => {
    try {
      setLoading(true)
      setData(null)
      setError(null)
      const data = await action(query)
      setData(data)
    } catch(e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }
  return [{ loading, error, data }, performAction]
}

const saveToGraphQLStore = async (query: string) => {
  let response = await axios.post("/graphql", { query })
  console.log(response)
  if (response.status !== 200) throw new Error(`Error: ${response.status} : ${response.statusText}`)
  let { data } = response.data
  console.log({data})
  return data
}

type StudentProps = {
  student: IStudent
}

const EditStudentForm: React.FC<StudentProps> = (props: StudentProps) => {
  const [student, setStudent] = useState(props.student)
  const [res, saveStudentToGraphQLStore] = useGraphQLStore(saveToGraphQLStore)
  const changeInputValue = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    setStudent(prevState => { return {...prevState, [name]: value} })
  }

  const saveStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = student.id ? updateStudentQuery(student) : createStudentQuery(student)
    saveStudentToGraphQLStore(query)
  }

  const StatusDisplay = () => (
    res.loading ? <div>Saving...</div> : res.error ? <div>Error!</div> : <div></div>
  )

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
      <StatusDisplay />
    </form>
  ) 
}

export const NewStudent: React.FC = () => <EditStudentForm student={newStudentData}/>

const EditStudent: React.FC = () => {
  const { params } = useRouteMatch();

  const res = useGraphQLFetch(fetchStudetQuery(params.studentId))
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
    return <EditStudentForm student={res.data.student}/>
  } 
  return <code>{JSON.stringify(res, null, 2)}</code>
}

export default EditStudent;
 
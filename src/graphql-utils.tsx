import React from "react"
import axios from "axios"

export type UseGraphQLFetchValue = {
  loading: boolean,
  error: null | {}
  data: any
  complete: boolean
}
  
export const useGraphQLQuery = (query: string) => {
  const [res, setRes] = React.useState<UseGraphQLFetchValue>({loading: true, error: null, data: null, complete: false});
  React.useEffect(() => {
    setRes({loading: true, error: null, data: null, complete: false});
    axios.post("/graphql", { query }).then(res => {
      setRes({...res.data, error: null, isLoading: false, complete: true})
    }).catch(error => {
      setRes({data: error , loading: false, error, complete: false})
    })
  }, [query])
  return res
}

export const useAsyncFunction = (action: Function):[UseGraphQLFetchValue, Function] => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [data, setData] = React.useState(null)
  const [complete, setComplete] = React.useState(false)

  const performAction = async (query: string) => {
    try {
      setLoading(true)
      setData(null)
      setError(null)
      const data = await action(query)
      setData(data)
      setComplete(true)
    } catch(e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }
  return [{ loading, error, data, complete }, performAction]
}

export const sendGrapQLMutation = async (query: string) => {
  let response = await axios.post("/graphql", { query })
  if (response.status !== 200) throw new Error(`Error: ${response.status} : ${response.statusText}`)
  let { data } = response.data
  return data
}

export const getIdFromResult = (data: any): number => {
  // data looks like this
  // {"data":{"__typename":"Mutation","createStudent":{"student":{"id":23}}}}
  const resultObjKey: string = Object.keys(data).filter(k => k.match((/(create|update)/)))[0]
  const accessor = resultObjKey.replace(/(create|update)/, '').toLowerCase()
  const id: number = data[resultObjKey][accessor]['id']
  return id
}
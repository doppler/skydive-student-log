import React, { useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

export type UseGraphQLFetchValue = {
  loading: boolean;
  error: null | {};
  data: any;
  complete: boolean;
};

export const useGraphQLQuery = (query: string) => {
  const [{ jwtToken }] = useContext(AuthContext);
  console.log({ jwtToken });
  const [res, setRes] = React.useState<UseGraphQLFetchValue>({
    loading: true,
    error: null,
    data: null,
    complete: false
  });
  if (jwtToken !== "")
    axios.defaults.headers.post["Authorization"] = `Bearer ${jwtToken}`;

  React.useEffect(() => {
    setRes({ loading: true, error: null, data: null, complete: false });
    axios
      .post("/graphql", { query })
      .then(res => {
        setRes({
          ...res.data,
          error: res.data.errors && res.data.errors.length && res.data.errors,
          loading: false,
          complete: true
        });
      })
      .catch(error => {
        setRes({ data: null, loading: false, error, complete: false });
      });
  }, [query]);
  return res;
};

type AsyncFunctionState = {
  loading: boolean;
  error: null | string | Object;
  data: null | Object;
  complete: boolean;
};

const useAsyncFunctionInitialState: AsyncFunctionState = {
  loading: false,
  error: null,
  data: null,
  complete: false
};

type ReducerAction = {
  type: string;
  payload?: any;
};

const useAsyncFunctionReducer = (
  state: AsyncFunctionState,
  action: ReducerAction
): AsyncFunctionState => {
  switch (action.type) {
    case "REQUEST_SEND":
      return { ...state, loading: true, data: null, error: null };
    case "DATA_ERRORS":
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        complete: true
      };
    case "REQUEST_DATA":
      return {
        ...state,
        data: action.payload.data,
        loading: false,
        complete: true
      };
    case "REQUEST_COMPLETE":
      return { ...state, complete: true, data: null };
    default:
      return state;
  }
};

export const useAsyncFunction = (
  action: Function
): [UseGraphQLFetchValue, Function] => {
  // const [loading, setLoading] = React.useState(false);
  // const [error, setError] = React.useState(null);
  // const [data, setData] = React.useState(null);
  // const [complete, setComplete] = React.useState(false);

  const [state, dispatch] = React.useReducer(
    useAsyncFunctionReducer,
    useAsyncFunctionInitialState
  );

  const performAction = async (query: string) => {
    try {
      // setLoading(true);
      // setData(null);
      // setError(null);
      dispatch({ type: "REQUEST_SEND" });
      const data = await action(query);
      console.log(data);
      if (data.errors && data.errors.length && data.errors.length > 0) {
        console.log(data.errors[0].message);
        dispatch({
          type: "DATA_ERRORS",
          payload: { message: data.errors[0].message }
        });
      } else dispatch({ type: "REQUEST_DATA", payload: { data: data.data } });
    } catch (e) {
      console.log({ error: e });
      // setError(e.message);
    } finally {
      dispatch({ type: "REQUEST_COMPLETE" });
    }
  };
  return [state, performAction];
};

export const sendGrapQLMutation = async (query: string) => {
  let response = await axios.post("/graphql", { query });
  if (response.status !== 200)
    throw new Error(`Error: ${response.status} : ${response.statusText}`);
  let { data, errors } = response.data; // response.data looks like {data, errors}
  return { data, errors };
};

export const getIdFromResult = (data: any): number => {
  // data looks like this
  // {"data":{"__typename":"Mutation","createStudent":{"student":{"id":23}}}}
  const resultObjKey: string = Object.keys(data).filter(k =>
    k.match(/(create|update)/)
  )[0];
  const accessor = resultObjKey.replace(/(create|update)/, "").toLowerCase();
  const id: number = data[resultObjKey][accessor]["id"];
  return id;
};

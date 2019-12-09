import React, { useCallback, useState } from "react";
import axios from "axios";
import { useAuth } from "./use-auth";

export type UseGraphQLFetchValue = {
  loading: boolean;
  error: null | {};
  data: any;
  complete: boolean;
};

export const useGraphQLQuery = (query: string) => {
  const { token } = useAuth();
  const [res, setRes] = React.useState<UseGraphQLFetchValue>({
    loading: true,
    error: null,
    data: null,
    complete: false
  });

  if (token) axios.defaults.headers.post["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.post["Authorization"];

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

export const useGraphQLMutation = (query: string): [any, any] => {
  const [res, setRes] = useState({ data: null, error: null, loading: false });
  const callApi = useCallback(() => {
    setRes((prevState: any) => ({ ...prevState, loading: true }));
    axios
      .post("/graphql", { query })
      .then(res => {
        setRes({ data: res.data.data, loading: false, error: null });
      })
      .catch(error => {
        setRes({ data: null, loading: false, error });
      });
  }, [query]);
  return [res, callApi];
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

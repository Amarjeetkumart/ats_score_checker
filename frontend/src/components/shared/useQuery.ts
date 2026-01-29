import { useCallback, useEffect, useRef, useState } from "react";

type UseQueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
};

type QueryFn<T> = () => Promise<T>;

export const useQuery = <T,>(key: unknown[], queryFn: QueryFn<T>): UseQueryResult<T> => {
  const cacheKey = JSON.stringify(key);
  const cacheRef = useRef(new Map<string, T>());
  const queryFnRef = useRef(queryFn);

  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);
  const [state, setState] = useState<{ data: T | null; isLoading: boolean; error: unknown }>(
    () => ({ data: null, isLoading: true, error: null })
  );

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await queryFnRef.current();
      cacheRef.current.set(cacheKey, data);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error });
    }
  }, [cacheKey]);

  useEffect(() => {
    if (cacheRef.current.has(cacheKey)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: populate initial state from cache without triggering fetch
      setState({ data: cacheRef.current.get(cacheKey) ?? null, isLoading: false, error: null });
      return;
    }
    fetchData();
  }, [cacheKey, fetchData]);

  const refetch = useCallback(async () => {
    cacheRef.current.delete(cacheKey);
    await fetchData();
  }, [cacheKey, fetchData]);

  return { ...state, refetch };
};

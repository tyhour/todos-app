"use client";

import { Timestamp } from "firebase/firestore";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export type TodoDataType = {
  id?: string;
  todo: string;
  isCompleted?: boolean;
  createdAt?: Timestamp;
};

interface ITodo {
  todos: TodoDataType[];
  setTodos: Dispatch<SetStateAction<TodoDataType[]>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  filterData: null | [] | TodoDataType[];
  onFilter: (search?: string, id?: string) => void;
}

const GlobalContext = createContext<ITodo>({
  todos: [],
  setTodos: (): TodoDataType[] => [],
  error: "",
  filterData: null,
  setError: (): string => "",
  onFilter: () => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [todos, setTodos] = useState<[] | TodoDataType[]>([]);
  const [filterData, setFilterData] = useState<null | [] | TodoDataType[]>(
    null
  );
  const [error, setError] = useState<string>("");

  const onFilter = (search: string = "", id?: string) => {
    if (id && (filterData ?? []).length > 0) {
      setFilterData((items) =>
        (items ?? []).filter((i: TodoDataType) => i.id != id)
      );
    } else {
      const reg = new RegExp(`.*${search.toLowerCase()}.*`);
      const filter = todos.filter((item: TodoDataType) =>
        item.todo.toLowerCase().match(reg)
      );
      setFilterData(search.trim().length == 0 ? null : filter);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        todos,
        setTodos,
        error,
        setError,
        filterData,
        onFilter,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useTodos = () => useContext(GlobalContext);

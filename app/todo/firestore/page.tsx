"use client";

import { ITodo, fetchTodos } from "@/utils/firestore";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const TodoListItem = dynamic(
  () => import("@/app/components/firestore/TodoListItem"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const TodoFirestore = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [todos, setTodos] = useState<ITodo[] | null>(null);
  const [search, setSearch] = useState<string>("");

  const onSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      fetchTodos(search, setTodos);
    }, 250);

    return () => {
      clearTimeout(searchTimeout);
    };
  }, [search]);

  return (
    <div className="w-full">
      <Link href={"/"}>{`< Back`}</Link>
      <p className="text-black font-bold my-4">Todo with Firestore</p>
      <div className="gap-2 flex flex-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search todo"
          className="flex-1 bg-white border border-gray-500 px-4 py-2 rounded-full"
          required
          onChange={onSearch}
        />
        <Link href={"/todo/firestore/create"} className="btn">
          Add Todo
        </Link>
      </div>
      <div className="my-6">
        {/* List Todos */}
        <TodoListItem todos={todos} />
      </div>
    </div>
  );
};

export default TodoFirestore;

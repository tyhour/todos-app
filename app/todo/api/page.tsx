"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchTodosAPI } from "@/utils/api";
import { ITodo } from "@/utils/firestore";

const TodoListItem = dynamic(
  () => import("@/app/components/api/TodoListItem"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

let searchTimeout: NodeJS.Timeout;

const TodoAPI = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [todos, setTodos] = useState<ITodo[] | null>(null);

  useEffect(() => {
    fetchTodosAPI("", setTodos);
  }, []);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchTodosAPI(e.target.value, setTodos);
    }, 250);
  };

  return (
    <div className="w-full">
      <Link href={"/"}>{`< Back`}</Link>
      <p className="text-black font-bold my-4">Todo with API</p>
      <div className="gap-2 flex flex-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search todo"
          className="flex-1 bg-white border border-gray-500 px-4 py-2 rounded-full"
          required
          onChange={onSearch}
        />
        <Link href={"/todo/api/create"} className="btn">
          Add Todo
        </Link>
      </div>
      <div className="my-6">
        {/* Conditional rendering for todos */}
        {todos ? (
          todos.length > 0 ? (
            <TodoListItem todos={todos} />
          ) : (
            <div>No todos found. Create a new one instead!</div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default TodoAPI;

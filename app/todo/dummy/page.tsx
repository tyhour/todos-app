"use client";

import React, { ChangeEvent, useRef } from "react";
import { useTodos } from "@/context/store";
import Link from "next/link";
import TodoListItem from "@/app/components/dummy/TodoListItem";

let searchTimeout: NodeJS.Timeout;
const TodoDummy = () => {
  const todoListRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { error, setError, onFilter } = useTodos();

  const handleAddTodo = () => {
    const isAdd = todoListRef.current.onVerify(null, null, inputRef);
    if (isAdd) {
      setError("");
      inputRef.current!.value = "";
      onFilter();
      setTimeout(() => {
        inputRef.current!.focus();
      }, 250);
    }
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      onFilter(e.target.value);
    }, 250);
  };

  return (
    <div className="w-full">
      <Link href={"/"}>{`< Back`}</Link>
      <p className="text-black font-bold my-4">Todo with Dummy Data</p>
      <p className="text-black my-4">
        {`**Note: Press "Enter" to Add/Edit Todo | Press 'Escape' to exit edit mode | For 'Search' just typing and wait a bit.`}
      </p>
      {error && (
        <p
          className="text-red-600 font-bold mb-4 cursor-pointer"
          onClick={() => setError("")}
        >
          {error}
        </p>
      )}
      <div className="gap-2 flex flex-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search or add todo"
          className="flex-1 bg-white border border-gray-500 px-4 py-2 rounded-full"
          required
          onChange={handleSearch}
          onKeyUp={handleSubmit}
        />
        <button className="btn" onClick={handleAddTodo}>
          {"Add Todo"}
        </button>
      </div>
      <div className="my-6">
        {/* List Todos */}
        <TodoListItem ref={todoListRef} />
      </div>
    </div>
  );
};

export default TodoDummy;

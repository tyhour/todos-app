"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { encryptTheValue } from "@/utils/security";
import { ITodo, deleteTodo, verifyTodo } from "@/utils/firestore";

interface TodoListItemProps {
  todos: ITodo[] | null;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todos }) => {
  const router = useRouter();

  if (!todos) {
    return <div>Loading...</div>;
  }

  if (todos.length === 0) {
    return <div>No todos found. Create a new one instead!</div>;
  }

  return (
    <div>
      {todos.map((item: ITodo) => (
        <div
          key={item.id}
          className="bg-slate-100 mt-2 rounded-xl h-14 items-center justify-between gap-2 flex flex-row border border-gray-100 group hover:bg-gray-200"
        >
          <p
            className={`font-bold flex-1 px-6 ${
              item.isCompleted && "line-through"
            }`}
          >
            {item.todo}
          </p>

          <div className={`flex-row gap-2 hidden group-hover:flex`}>
            <button
              className="btn bg-green-400"
              onClick={() => {
                const query = encryptTheValue(item);
                router.push(
                  `/todo/firestore/update/${item?.document_id}?query=${query}`
                );
              }}
            >
              Edit Todo
            </button>
            <button
              className="btn bg-red-400"
              onClick={() => deleteTodo(item.document_id ?? "")}
            >
              Delete Todo
            </button>
            <button
              className="btn bg-blue-400"
              onClick={() =>
                verifyTodo({
                  ...item,
                  isCompleted: !item?.isCompleted,
                })
              }
            >
              {item.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TodoListItem);

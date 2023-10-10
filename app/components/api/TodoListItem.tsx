"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { encryptTheValue } from "@/utils/security";
import { deleteTodosAPI, verifyTodosAPI } from "@/utils/api";
import { ITodo } from "@/utils/firestore";

interface TodoListItemProps {
  todos: ITodo[] | null;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todos }) => {
  const router = useRouter();
  const [data, setData] = useState<ITodo[] | null>(todos);

  useEffect(() => {
    setData(todos);
  }, [todos]);

  const onMarkCompleted = async (item: ITodo) => {
    if (data) {
      const updatedData = data.map((todo: ITodo) => {
        if (todo.id === item.id) {
          // Toggle the isCompleted property
          return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
      });

      setData(updatedData);
      // Call the API with the updated item
      await verifyTodosAPI({ ...item, isCompleted: !item.isCompleted });
    }
  };

  const onDelete = async (item: ITodo) => {
    try {
      setData((d) => (d ?? []).filter((i: ITodo) => i.id !== item.id));
      await deleteTodosAPI(item);
    } catch (error) {
      // Handle API request failure
      // Display an error message to the user
    }
  };

  if (data == null) {
    return <div>Loading...</div>;
  }

  if (data?.length === 0) {
    return <div>No todos found. Create a new one instead!</div>;
  }

  return (
    <div>
      {data.map((item: ITodo) => (
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
                router.push(`/todo/api/update/${item?.id}?query=${query}`);
              }}
            >
              Edit Todo
            </button>
            <button className="btn bg-red-400" onClick={() => onDelete(item)}>
              Delete Todo
            </button>
            <button
              className="btn bg-blue-400"
              onClick={() => onMarkCompleted(item)}
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

import { Dispatch } from "react";
import { ITodo } from "./firestore";

export function successResponse(data: any = null) {
  return Response.json({
    success: true,
    data,
  });
}

export function errorResponse(
  msg: string = "Internal Server Error",
  statusCode: number = 500
) {
  return Response.json(
    {
      success: false,
      msg,
    },
    { status: statusCode }
  );
}

export const fetchTodosAPI = async (
  search: string,
  setTodos: Dispatch<React.SetStateAction<ITodo[] | null>>
) => {
  const request = await fetch(
    `${window.location.origin}/api/todo?search=${search.toLowerCase()}`
  );
  const result = await request.json();
  if (result?.success) {
    setTodos(result?.data);
  }
};

export const verifyTodosAPI = async (item: ITodo) => {
  let url = `${window.location.origin}/api/todo`;
  if (item?.id) {
    url = `${url}/${item?.id}`;
  }
  const options = {
    method: item?.id ? "PUT" : "POST",
    body: JSON.stringify(item),
  };
  const request = await fetch(url, options);
  const result = await request.json();
  return result;
};

export const deleteTodosAPI = async (item: ITodo) => {
  if (confirm("Do you want to delete this todo?")) {
    let url = `${window.location.origin}/api/todo/${item?.id}`;
    const options = {
      method: "DELETE",
    };
    const request = await fetch(url, options);
    const result = await request.json();
    return result;
  }
  return {
    success: false,
  };
};

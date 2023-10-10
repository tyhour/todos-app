"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { decryptTheValue } from "@/utils/security";
import { verifyTodosAPI } from "@/utils/api";
import { ITodo } from "@/utils/firestore";

interface IParams {
  form: string;
  id: string;
}

interface TodoFormProps {
  params: IParams;
  searchParams: any;
}

const TodoForm: React.FC<TodoFormProps> = ({ params, searchParams }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const { query } = searchParams;
  const title = params.form[0];
  const id = params.form[1];
  const [error, setError] = useState<string>(""); // Provide an initial value
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Provide an initial value

  let decryptQuery: ITodo | null = null;
  if (query) {
    var originalObject = decryptTheValue(query);
    decryptQuery = originalObject;
  }

  const messageAlert = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
  };

  const onVerify = async (item: ITodo) => {
    setIsSubmitting(true);
    const result = await verifyTodosAPI(item);
    if (result?.success) {
      router.push("/todo/api");
    } else {
      const msg =
        result?.msg === "exists"
          ? "Todo already exists! [X]"
          : result?.msg === "missing"
          ? "Invalid todo id."
          : "Please input todo. [X]";
      messageAlert(msg);
    }
    setIsSubmitting(false);
  };

  const onAction = () => {
    onVerify({
      ...decryptQuery,
      id,
      todo: inputRef.current?.value ?? "",
    });
  };

  const onSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onVerify({
        ...decryptQuery,
        id,
        todo: inputRef.current?.value ?? "",
      });
    }
  };

  return (
    <div className="w-full">
      <Link href={"/todo/api"}>{`< Back to Todos`}</Link>
      <p className="text-black font-bold my-4 first-letter:uppercase">
        {title} Todo
      </p>
      {error && (
        <p
          className="text-red-600 font-bold mb-4 cursor-pointer"
          onClick={() => setError("")}
        >
          {error}
        </p>
      )}
      <div className="flex flex-col gap-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter todo"
          className={`flex bg-white border border-gray-500 px-4 py-2 rounded-full`}
          required
          readOnly={isSubmitting}
          autoFocus
          defaultValue={decryptQuery?.todo}
          onKeyUp={onSubmit}
        />
        <div className="flex justify-end">
          <button
            className={`btn ${isSubmitting && "disabled opacity-70"}`}
            onClick={onAction}
          >
            <p className="first-letter:uppercase">
              {isSubmitting ? "Saving..." : "Save Todo"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;

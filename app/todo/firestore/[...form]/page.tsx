"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptTheValue } from "@/utils/security";
import { verifyTodo } from "@/utils/firestore";
import Link from "next/link";

interface IParams {
  form: string;
  document_id: string;
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
  const documentId = params.form[1];
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const decryptQuery = query ? decryptTheValue(query) : null;

  const messageAlert = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
  };

  const onVerify = async () => {
    setIsSubmitting(true);
    const result = await verifyTodo({
      ...decryptQuery,
      document_id: documentId,
      todo: inputRef?.current?.value,
    });
    if (result?.success) {
      router.push("/todo/firestore");
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

  const onSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onVerify();
    }
  };

  return (
    <div className="w-full">
      <Link href="/todo/firestore">{`< Back`}</Link>
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
          readOnly={isSubmitting}
          required
          autoFocus
          defaultValue={decryptQuery?.todo}
          onKeyUp={onSubmit}
        />
        <div className="flex justify-end">
          <button
            className={`btn ${isSubmitting && "disabled opacity-70"}`}
            onClick={onVerify}
          >
            <p className="first-letter:uppercase">
              {isSubmitting ? "Submit..." : title}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;

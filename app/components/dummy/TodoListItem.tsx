import { TodoDataType, useTodos } from "@/context/store";
import { Timestamp } from "firebase/firestore";
import React, { useImperativeHandle, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function TodoListItem(_: any, ref: React.Ref<unknown> | undefined) {
  const { setError, filterData, onFilter, todos, setTodos } = useTodos();
  let inputRef = useRef<any>(null);
  const [currentItem, setCurrentItem] = useState<TodoDataType | null>(null);

  useImperativeHandle(ref, () => ({
    onVerify,
  }));

  const messageAlert = (
    input: any = inputRef,
    msg: string = "Please input todo. [X]"
  ) => {
    setError(msg);
    setTimeout(() => {
      input.current.focus();
    }, 250);
  };

  const onVerify = (
    id: string | null | undefined = null,
    is_completed: boolean | null = null,
    input: any = inputRef
  ) => {
    if (is_completed == null) {
      if (input.current.value.trim().length == 0) {
        messageAlert(input);
        return false;
      }
      const checkTodo = todos.find(
        (item: TodoDataType) =>
          item.todo.toLowerCase() == input.current.value.toLowerCase() &&
          item.id != (id ?? 0)
      );

      if (checkTodo) {
        messageAlert(input, "Todo already exists! [X]");
        return false;
      }
    }
    let data: TodoDataType[] = [];
    if (id) {
      const currentTodo = todos.find((item: TodoDataType) => item.id == id);
      if (currentTodo) {
        if (is_completed != null) currentTodo.isCompleted = !is_completed;
        else currentTodo.todo = input.current.value ?? "";
      }
      data = [...todos];
    } else {
      data = [
        ...todos,
        {
          id: uuidv4(),
          todo: input.current.value ?? "",
          isCompleted: false,
          createdAt: Timestamp.now(),
        },
      ];
    }
    setTodos(data);
    return true;
  };

  const onEdit = (item: TodoDataType) => {
    setCurrentItem(item);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 250);
  };

  const onUpdate = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todo: TodoDataType
  ) => {
    if (e.key == "Enter") {
      const success = onVerify(todo.id, null, inputRef);
      if (success) {
        setCurrentItem(null);
      }
    } else if (e.key == "Escape") {
      setCurrentItem(null);
    }
  };

  const onDelete = (id?: string) => {
    if (confirm("Do you want to delete this todo?")) {
      setTodos((todos) => todos.filter((item: TodoDataType) => item.id !== id));
      onFilter("", id);
    }
  };

  return (
    <div>
      {(filterData ?? todos).length == 0 ? (
        <div>No result. Create a new one instead!</div>
      ) : (
        (filterData ?? todos).map((item: TodoDataType) => {
          const isEdit = currentItem?.id == item?.id;
          return (
            <div
              key={item.id}
              className="bg-slate-100 mt-2 rounded-xl h-14 items-center justify-between gap-2 flex flex-row border border-gray-100 group hover:bg-gray-200"
            >
              {!isEdit ? (
                <p
                  className={`font-bold flex-1 px-6 ${
                    item.isCompleted && "line-through"
                  }`}
                >
                  {item.todo}
                </p>
              ) : (
                <input
                  ref={inputRef}
                  placeholder="Enter todo"
                  required
                  className="flex-1 bg-white border border-gray-500 px-4 mx-2 py-2 rounded-full"
                  onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    onUpdate(e, item)
                  }
                  defaultValue={item.todo}
                />
              )}
              <div
                className={`flex-row gap-2 hidden ${
                  !isEdit && "group-hover:flex"
                }`}
              >
                <button
                  className="btn bg-green-400"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn bg-red-400"
                  onClick={() => onDelete(item?.id)}
                >
                  Delete
                </button>
                <button
                  className="btn bg-blue-400"
                  onClick={() =>
                    onVerify(item?.id, item.isCompleted ?? false, inputRef)
                  }
                >
                  {item.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default React.memo(React.forwardRef(TodoListItem));

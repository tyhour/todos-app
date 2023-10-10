import { db } from "@/config/firebase";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";
import { createKeyWords } from "./convert";

export interface ITodo {
  id?: string;
  document_id?: string;
  todo: string;
  todo_search?: string;
  keyword?: string[];
  isCompleted?: boolean;
  createdAt?: Timestamp;
}

export type FirebaseType = {
  docs: CollectionReference<DocumentData, DocumentData>;
  docRef: DocumentReference<DocumentData, DocumentData> | any;
};

export const firestoreObject = (document_id?: string) => {
  const docs = collection(db, "todos");
  let docRef = null;
  if (document_id) docRef = doc(db, "todos", document_id);
  const data: FirebaseType = {
    docs,
    docRef,
  };
  return data;
};

export async function verifyTodo(item: ITodo) {
  if (item.todo.trim().length == 0) {
    return {
      success: false,
      msg: "required",
    };
  }

  const { docs, docRef }: FirebaseType = firestoreObject(item?.document_id);

  //Check exists todo
  const q = query(
    docs,
    where("todo_search", "==", item.todo.toLowerCase()),
    where("id", "!=", item?.id ?? "")
  );
  const docItems = await getDocs(q);
  if (!docItems.empty) {
    return {
      success: false,
      msg: "exists",
    };
  }

  const params = {
    todo: item.todo,
    todo_search: item.todo.toLowerCase(),
    keyword: createKeyWords(item.todo.toLowerCase()),
    isCompleted: item?.isCompleted ?? false,
  };
  if (item?.document_id) {
    try {
      await updateDoc(docRef, params);
    } catch (error) {
      return {
        success: false,
        msg: "missing",
      };
    }
    return {
      success: true,
      msg: "updated",
    };
  }
  await addDoc(docs, {
    id: uuidv4(),
    ...params,
    createdAt: Timestamp.now(),
  });
  return {
    success: true,
    msg: "created",
  };
}

export function fetchTodos(
  searchText: string,
  setTodos: Dispatch<SetStateAction<ITodo[] | null>>
) {
  const { docs }: FirebaseType = firestoreObject();
  const search = searchText.toLowerCase();
  const q = query(
    docs,
    where("keyword", search.length == 0 ? "!=" : "array-contains", search)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    let items: ITodo[] = [];
    querySnapshot.forEach((doc: DocumentData | { id: string; data: ITodo }) => {
      items.push({ ...doc.data(), document_id: doc.id });
    });
    items = items.sort((a: ITodo, b: ITodo) => {
      return (
        (a.createdAt ?? Timestamp.now()).toMillis() -
        (b.createdAt ?? Timestamp.now()).toMillis()
      );
    });
    setTodos(items);
  });
  return unsubscribe;
}

export async function deleteTodo(document_id: string) {
  if (confirm("Do you want to delete this todo?")) {
    const { docRef }: FirebaseType = firestoreObject(document_id);
    await deleteDoc(docRef);
  }
}

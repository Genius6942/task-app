import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { generateId, getDoc } from ".";
import { db } from "..";

const updateTask = (taskId, task) => {
  return new Promise(async (resolve, reject) => {
    const col = collection(db, "tasks");
    const q = query(col, where("id", "==", taskId));
    const ref = (await getDocs(q)).docs[0].ref;

    await updateDoc(ref, task);
    resolve(true);
  });
};

const removeTask = async (taskId) => {
  const col = collection(db, "tasks");
  const q = query(col, where("id", "==", taskId));
  const ref = (await getDocs(q)).docs[0].ref;

  deleteDoc(ref);
};

const createTask = async (uid, task) => {
  const col = collection(db, "tasks");
  if (navigator.onLine)
    await addDoc(col, { ...task, ownerId: uid, id: generateId() });
  else {
    addDoc(col, { ...task, ownerId: uid, id: generateId() });
    // wait a little bit
    await new Promise((r) => setTimeout(r, 300));
  }
  return true;
};

const getTasks = async (uid) => {
  const col = collection(db, "tasks");
  const q = query(col, where("ownerId", "==", uid));
  const result = await getDocs(q);

  return result.docs.map((doc) => doc.data());
};

export { createTask, getTasks, updateTask, removeTask };

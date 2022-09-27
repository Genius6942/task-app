import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "firebase/firestore";
import { getDoc } from ".";
import { db } from "..";

const updateTask = (taskId, task) => {
  return new Promise(async (resolve, reject) => {
    const result = await getDoc(
      "tasks",
      { field: "id", value: taskId },
      async (col) => {
        reject("task not found");
      },
      true
    );
    await updateDoc(result.ref, task);
    resolve(true);
  });
};

const removeTask = async (taskId) => {
  const col = collection(db, "tasks");
  const q = query(col, where("id", "==", taskId));
  const ref = (await getDocs(q)).docs[0].ref;

  deleteDoc(ref)
};

const createTask = async (uid, task) => {
  const col = collection(db, "tasks");
  await addDoc(col, { ...task, ownerId: uid, id: generateId() });
  return true;
};

const getTasks = async (uid) => {
  const col = collection(db, "tasks");
  const q = query(col, where("ownerId", "==", uid));
  const result = await getDocs(q);

  return result.docs.map((doc) => doc.data());
};

export { createTask, getTasks, updateTask, removeTask };
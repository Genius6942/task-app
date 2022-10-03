import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "..";

// function to generate an id with numbers and letters of length 20
const generateId = () => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 *
 * @param {string} colName
 * @param {object} query
 * @param {string?} query.field
 * @param {string?} query.operator
 * @param {string} query.value
 * @param {(col: import('firebase/firestore').CollectionReference<import('firebase/firestore').DocumentData) => object} fallback
 * @param {boolean} getRef
 * @returns {Promise<import('firebase/firestore').DocumentData>}
 */
const getDoc = async (
  colName,
  { field = "ownerId", operator = "==", value },
  fallback = (col) => ({}),
  getRef = false
) => {
  const col = collection(db, colName);
  const q = query(col, where(field, operator, value));
  const docs = await getDocs(q);
  if (docs.docs.length > 0) {
    return getRef ? docs.docs[0].ref : docs.docs[0].data();
  } else {
    return fallback(col);
  }
};

const getUserBoard = async (uid) => {
  const result = await getDoc("boards", { value: uid }, async (col) => {
    const newId = generateId();
    await addDoc(col, {
      ownerId: uid,
      id: newId,
      subjects: "[]",
    });
    return { ownerId: uid, id: newId, subjects: "[]" };
  });

  return JSON.parse(result.subjects);
};

const getSubject = (subjectId) => {
  return new Promise(async (resolve, reject) => {
    const result = await getDoc(
      "subjects",
      { field: "id", value: subjectId },
      async (col) => {
        reject("Subject not found");
      }
    );
    resolve(result);
  });
};

const updateSubject = (subjectId, subject) => {
  return new Promise(async (resolve, reject) => {
    const result = await getDoc(
      "subjects",
      { field: "id", value: subjectId },
      async (col) => {
        reject("Subject not found");
      },
      true
    );
    await updateDoc(result.ref, subject);
    resolve(true);
  });
};

const createSubject = async (uid, subject) => {
  const col = collection(db, "subjects");
  addDoc(col, { ...subject, ownerId: uid, id: generateId() });
  return true;
};

const getTask = (taskId) => {
  return new Promise(async (resolve, reject) => {
    const result = await getDoc(
      "tasks",
      { field: "id", value: taskId },
      async (col) => {
        reject("Task not found");
      }
    );
    resolve(result);
  });
};

const updateTask = (taskId, Task) => {
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

const createTask = async (uid, task) => {
  const col = collection(db, "tasks");
  await addDoc(col, { ...task, ownerId: uid, id: generateId() });
  return true;
};

const updateUserBoard = async (uid, board) => {
  const col = collection(db, "boards");
  const q = query(col, where("owner_id", "==", uid));
  const docs = await getDocs(q);

  if (docs.docs.length >= 0) {
    const result = await updateDoc(docs.docs[0].ref, {
      content: JSON.stringify(board),
    });
    return result;
  } else {
    return null;
  }
};

export {
  getUserBoard,
  updateUserBoard,
  getSubject,
  updateSubject,
  createSubject,
  createTask,
  updateTask,
  getTask,
  getDoc,
  generateId,
};

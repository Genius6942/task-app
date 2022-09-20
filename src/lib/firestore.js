import { query, getDocs, collection, where, addDoc, updateDoc } from "firebase/firestore";

import { db } from "./firebase";

// function to generate an id with numbers and letters of length 20
const generateId = () => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
 * @returns {object}
 */
const getDoc = async (
  colName,
  { field = "ownerId", operator = "==", value },
  fallback = () => {},
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

const getUserBoard = async uid => {
  const result = await getDoc("boards", { value: uid }, async col => {
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

const getSubject = subjectId => {
  return new Promise(async (resolve, reject) => {
    const result = await getDoc(
      "subjects",
      { field: "id", value: subjectId },
      async col => {
        reject("Subject not found");
      }
    );
    resolve(result);
  });
};

const updateSubject = async (subjectId, subject) => {
  return new Promise(async (resolve, reject) => {
    const result = await getDoc(
      "subjects",
      { field: "id", value: subjectId },
      async col => {
        reject("Subject not found");
      },
      true
    );
    await updateDoc(result.ref, subject);
    resolve(true);
  });
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

export { getUserBoard, updateUserBoard };

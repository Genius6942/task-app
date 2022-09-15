import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const getUserBoard = async (uid) => {
  const col = collection(db, "boards");
  const q = query(col, where("owner_id", "==", uid));
  const docs = await getDocs(q);

  if (docs.docs.length === 0) {
    const result = await addDoc(col, {
      owner_id: uid,
      content: "[]",
    });

    return [];
  } else {
    return JSON.parse(docs.docs[0].data().content);
  }
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

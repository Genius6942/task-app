import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
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
    return JSON.parse(docs.docs[0].data.content);
  }
};

export { getUserBoard };

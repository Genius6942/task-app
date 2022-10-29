import { updateProfile } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { getDoc } from ".";
import { app, db } from "..";
import { getTasks } from "./task";

const updateUser = async (uid, data) => {
  const col = collection(db, "users");
  const q = query(col, where("uid", "==", uid));
  const docs = await getDocs(q);

  if (!docs.docs[0]) throw new Error("Error occured when getting account");
  const currentData = docs.docs[0].data();

  const newData = { ...currentData, ...data };

  updateDoc(docs.docs[0].ref, newData);

  return true;
};

const getUser = async (uid) => {
  return new Promise(async (resolve, reject) => {
    const res = await getDoc("users", { field: "uid", value: uid }, () => {
      reject("Error occured when getting account");
    });

    resolve(res);
  });
};
const removeUser = async (uid) => {
  const ref = await getDoc(
    "users",
    { field: "uid", value: uid },
    () => {
      throw new Error("User not found");
    },
    true
  );
  await deleteDoc(ref);
  const col = collection(db, "tasks");
  const q = query(col, where("ownerId", "==", uid));
  const res = await getDocs(q);
  await Promise.all(
    res.docs
      .map((doc) => doc.ref)
      .map(async (docRef) => {
        await deleteDoc(docRef);
        return docRef;
      })
  );
  return true;
};

/**
 *
 * @param {import('firebase/auth').User} user
 */
const createUser = async (user) => {
  try {
    await getUser(user.uid);
  } catch (e) {
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: user.displayName,
      authProvider: "local",
      email: user.email,
    });
  }
};

const updateProfilePicture = async (user, file) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, "avatars_" + user.uid);
  const result = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await updateProfile(user, { photoURL: url });
  return url;
};

export { updateUser, getUser, createUser, updateProfilePicture, removeUser };

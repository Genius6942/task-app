import { getDoc } from ".";
import {
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app, db } from "..";
import { updateProfile } from "firebase/auth";

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
  return await getDoc("users", { field: "uid", value: uid }, () => {
    throw new Error("Error occured when getting account");
  });
};

const updateProfilePicture = async (user, file) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, "avatars_" + user.uid);
  const result = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await updateProfile(user, { photoURL: url });
  return url;
};

export { updateUser, getUser, updateProfilePicture };

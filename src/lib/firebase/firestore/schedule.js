import { addDoc } from "firebase/firestore";

import { generateId, getDoc } from ".";

const getSchedule = async (uid) => {
  const result = await getDoc("schedules", { value: uid }, async (col) => {
    const data = {
      id: generateId(),
      ownerId: uid,
    };
    await addDoc(col, data);

    return;
  });

  return result;
};

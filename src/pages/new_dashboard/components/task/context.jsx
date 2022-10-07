import { createContext, useContext, useEffect, useState } from "react";

import isEqual from "lodash/isEqual";

import { getTasks } from "../../../../lib/firebase/firestore/task";

const TaskContext = createContext({ fetchTaskUpdate: () => {}, tasks: [] });

/**
 * @param {object} props
 * @param {import('firebase/auth').User | null | undefined} props.user
 */
const TaskContextProvider = ({ user, ...props }) => {
  const [tasks, setTasks] = useState([]);
  const fetchTaskUpdate = async () => {
    if (user) {
      const fetchedTasks = await getTasks(user.uid);
      if (isEqual(tasks, fetchedTasks)) return false;
      setTasks(fetchedTasks);
      return fetchedTasks;
    }

    return false;
  };
  useEffect(() => {
    fetchTaskUpdate();
    const interval = setInterval(() => fetchTaskUpdate(), 5000);
    return () => clearInterval(interval);
  }, [user]);

  return <TaskContext.Provider {...props} value={{ fetchTaskUpdate, tasks }} />;
};

const useTasks = () => useContext(TaskContext);

export { useTasks, TaskContextProvider };

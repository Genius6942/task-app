import { createContext, useContext, useEffect, useState } from "react";

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
      const tasks = await getTasks(user.uid);
      setTasks(tasks);
      return tasks;
    }

    return false;
  };
  useEffect(() => {
    fetchTaskUpdate();
  }, [user]);

  return <TaskContext.Provider {...props} value={{ fetchTaskUpdate, tasks }} />;
};

const useTasks = () => useContext(TaskContext);

export { useTasks, TaskContextProvider };

import { createContext, useContext, useEffect, useState } from "react";

import isEqual from "lodash/isEqual";
import moment from "moment";

import { getTasks } from "../../../../lib/firebase/firestore/task";

const TaskContext = createContext({
  fetchTaskUpdate: async () => {},
  /**
   * @type {import('../../../../types').task[]}
   */
  tasks: [],
});

const generateTaskStatus = (data) => {
  if (data.dueDate.isBefore(moment().startOf("day").add(1, "day"))) return 3;
  else if (
    data.completes.filter((item) => item).length <
    moment.duration(moment().startOf("day").diff(data.startDate)).asDays()
  )
    return 2;
  else return 1;
};

/**
 * @param {object} props
 * @param {import('firebase/auth').User | null | undefined} props.user
 */
const TaskContextProvider = ({ user, ...props }) => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.windowTasks = tasks.map((task) => task.name).join(", ");
    }
  }, [tasks]);

  const fetchTaskUpdate = async () => {
    if (user || localStorage.getItem("uid")) {
      const fetchedTasks = await getTasks(
        user ? user.uid : localStorage.getItem("uid")
      );
      if (isEqual(tasks, fetchedTasks)) return false;
      const formattedFetchedTasks = fetchedTasks.map((task) => ({
        ...task,
        startDate: moment(task.startDate, "MM/DD/YYYY"),
        dueDate: moment(task.dueDate, "MM/DD/YYYY"),
      }));
      /**
       * @type {import('../../../../types').task}
       */
      const fetchedTasksWithStatus = formattedFetchedTasks.map((task) => ({
        ...task,
        status: generateTaskStatus(task),
      }));

      setTasks(fetchedTasksWithStatus);
      return fetchedTasksWithStatus;
    }

    return false;
  };

  const liveFetch = false;
  useEffect(() => {
    fetchTaskUpdate();
    if (liveFetch) {
      if ("connection" in navigator) {
        if (!navigator.connection.saveData) {
          const interval = setInterval(() => fetchTaskUpdate(), 5000);
          return () => clearInterval(interval);
        }
      } else {
        const interval = setInterval(() => fetchTaskUpdate(), 5000);
        return () => clearInterval(interval);
      }
    }
  }, [user]);
  return <TaskContext.Provider {...props} value={{ fetchTaskUpdate, tasks }} />;
};

const useTasks = () => useContext(TaskContext);

export { useTasks, TaskContextProvider };

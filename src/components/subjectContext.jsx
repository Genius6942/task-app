import { createContext, useContext, useEffect, useState } from "react";

import isEqual from "lodash/isEqual";

import { getUser } from "../lib/firebase/firestore/user";

const SubjectContext = createContext({
  fetchSubjectUpdate: () => {},
  /**
   * @type {{id: number, name: string}[]}
   */
  subjects: [],
});

/**
 * @param {object} props
 * @param {import('firebase/auth').User | null | undefined} props.user
 */
const SubjectContextProvider = ({ user, ...props }) => {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.windowSubjects = subjects
        .map((subject) => subject.name)
        .join(", ");
    }
  }, [subjects]);

  const fetchSubjectUpdate = async () => {
    if (user || localStorage.getItem("uid")) {
      const { subjects: fetchedSubjects } = await getUser(
        user ? user.uid : localStorage.getItem("uid")
      );
      if (isEqual(subjects, fetchedSubjects)) return false;

      setSubjects(fetchedSubjects);
      return fetchedSubjects;
    }

    return false;
  };

  const liveFetch = false;
  useEffect(() => {
    fetchSubjectUpdate();
    if (liveFetch) {
      if ("connection" in navigator) {
        if (!navigator.connection.saveData) {
          const interval = setInterval(() => fetchSubjectUpdate(), 5000);
          return () => clearInterval(interval);
        }
      } else {
        const interval = setInterval(() => fetchSubjectUpdate(), 5000);
        return () => clearInterval(interval);
      }
    }
  }, [user]);

  return (
    <SubjectContext.Provider
      {...props}
      value={{ fetchSubjectUpdate, subjects }}
    />
  );
};

const useSubjects = () => useContext(SubjectContext);

export { useSubjects, SubjectContextProvider };

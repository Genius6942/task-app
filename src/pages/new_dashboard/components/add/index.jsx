import { Fab } from "@mui/material";

import { Add } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../../../lib/firebase";
import { createTask } from "../../../../lib/firebase/firestore/task";
import { getUser } from "../../../../lib/firebase/firestore/user";
import { useSmallScreen } from "../../../../lib/utils";
import { useTasks } from "../task/context";
import AddTaskDialog from "./dialog";

export default function AddButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [subjects, setSubjects] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const pullSubjectData = async () => {
    const compareSubjects = (first, second) => {
      if (!first || !second) {
        return false;
      }
      if (first.length !== second.length) {
        return false;
      }
      for (let i = 0; i < first.length; i++) {
        const f = first[i];
        const s = second[i];
        for (let key of Object.keys(f)) {
          if (!(typeof s === "object" && f[key] === s[key])) {
            return false;
          }
        }
      }
      return true;
    };
    const userData = await getUser(user.uid);
    if (!compareSubjects(subjects, userData.subjects)) {
      setSubjects(userData.subjects || []);
    }
  };

  useEffect(() => {
    if (!user || loading) return;

    pullSubjectData();
  }, [user, loading]);
  useEffect(() => {
    const interval = setInterval(() => {
      user && pullSubjectData();
    }, 3000);

    return () => clearInterval(interval);
  }, [subjects]);

  const { fetchTaskUpdate } = useTasks();

  const onSubmit = async (data) => {
    const clone = { ...data };
    const days =
      data.timeConf === "once"
        ? 1
        : clone.dueDate.diff(clone.startDate, "days");
    const completes = Array(days).fill(false);
    clone.completes = completes;
    clone.startDate = clone.startDate.format("MM/DD/YYYY");
    clone.dueDate = clone.dueDate.format("MM/DD/YYYY");
    await createTask(user.uid, clone);
    fetchTaskUpdate();
    return true;
  };

  const smallScreen = useSmallScreen();

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: smallScreen ? "absolute" : "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => {
          setDialogOpen(true);
          setResetKey(resetKey + 1);
        }}
      >
        <Add />
      </Fab>
      <AddTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        subjects={subjects}
        onSubmit={onSubmit}
        resetKey={resetKey}
      />
    </>
  );
}

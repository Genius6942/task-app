import { Fab } from "@mui/material";

import { Add } from "@mui/icons-material";

import { useState } from "react";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffectOnce } from "react-use";

import { auth } from "../../../../lib/firebase";
import { createTask } from "../../../../lib/firebase/firestore/task";
import { getUser } from "../../../../lib/firebase/firestore/user";
import { useSmallScreen } from "../../../../lib/utils";
import { useTasks } from "../task/context";
import AddTaskDialog from "./dialog";

export default function AddButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [subjects, setSubjects] = useState(null);

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
    const days = clone.dueDate.diff(clone.startDate, "days");
    const completes = Array(days).fill(false);
    clone.completes = completes;
    clone.startDate = clone.startDate.format("MM/DD/YYYY");
    clone.dueDate = clone.dueDate.format("MM/DD/YYYY");
    await createTask(user.uid, clone);
    console.log("create task", clone);
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
        }}
      >
        <Add />
      </Fab>
      <AddTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        subjects={subjects}
        onSubmit={onSubmit}
      />
    </>
  );
}

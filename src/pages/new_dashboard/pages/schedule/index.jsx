import { Box, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  removeTask,
  updateTask,
} from "../../../../lib/firebase/firestore/task";
import Task from "../../components/task";
import { useTasks } from "../../components/task/context";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../lib/firebase";
import Day from "./day";

export default function Schedule() {
  const { tasks, fetchTaskUpdate } = useTasks();

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (!user || loading) return;
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <Stack gap={2} my={2}>
        <Day day={moment().startOf('day')} />
      </Stack>
    </Box>
  );
}

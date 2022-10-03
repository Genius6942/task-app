import { Box, Stack, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

import { auth } from "../../../../lib/firebase";
import {
  removeTask,
  updateTask,
} from "../../../../lib/firebase/firestore/task";
import Task from "../../components/task";
import { useTasks } from "../../components/task/context";
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
        <Day day={moment().startOf("day")} />
      </Stack>
    </Box>
  );
}

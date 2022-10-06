import { Box, Stack, Typography } from "@mui/material";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

import { removeTask, updateTask } from "../../../lib/firebase/firestore/task";
import Task from "../components/task";
import { useTasks } from "../components/task/context";
import { transformTask } from "../components/task/transform";

export default function Home() {
  const today = moment().startOf("day");
  const { tasks, fetchTaskUpdate } = useTasks();
  const dayTasks = tasks.map(transformTask).filter((task) => {
    if (!today.isBetween(task.startDate, task.dueDate, null, "[)"))
      return false;
    return true;
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
      <Typography mt={3} fontWeight="bold" whiteSpace="nowrap" fontSize={40}>
        {moment().format("dddd, MM/DD")}
      </Typography>
      <Stack gap={2} my={2} direction="column">
        <AnimatePresence>
          {dayTasks.map((task, idx) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              key={idx}
            >
              <Task
                taskData={task}
                onChange={async (data) => {
                  await updateTask(task.id, data);
                  fetchTaskUpdate();
                }}
                onRemove={async () => {
                  await removeTask(task.id);
                  fetchTaskUpdate();
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}

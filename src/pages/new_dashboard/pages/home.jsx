import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { removeTask, updateTask } from "../../../lib/firebase/firestore/task";
import Task from "../components/task";
import { useTasks } from "../components/task/context";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { tasks, fetchTaskUpdate } = useTasks();
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
      <Typography mt={3} fontWeight="bold" fontSize={50}>
        {moment().format("dddd, MM/DD")}
      </Typography>
      <Stack gap={2} my={2}>
        <AnimatePresence>
          {tasks.map((task, idx) => (
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

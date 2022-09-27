import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { removeTask, updateTask } from "../../../lib/firebase/firestore/task";
import Task from "../components/task";
import { useTasks } from "../components/task/context";
import moment from "moment";

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
        {tasks.map((task, idx) => (
          <Task
            taskData={task}
            key={idx}
            onChange={async (data) => {
              await updateTask(task.id, data);
              fetchTaskUpdate();
            }}
            onRemove={async () => {
              await removeTask(task.id);
              fetchTaskUpdate();
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

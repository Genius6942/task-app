import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Task from "../components/task";
import { useTasks } from "../components/task/context";

export default function Home() {

  const { tasks } = useTasks();
  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        py: 3,
      }}
    >
      <Stack gap={2}>
        {tasks.map((task, idx) => (
          <Task data={task} key={idx} onChange={(data) => console.log(data)} />
        ))}
      </Stack>
    </Box>
  );
}

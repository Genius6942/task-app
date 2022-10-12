import { Box, IconButton, Typography } from "@mui/material";

import { InfoOutlined as Info } from "@mui/icons-material";

import moment from "moment";

import { useTasks } from "../components/task/context";
import { transformTask } from "../components/task/transform";
import Day from "./schedule/day";

export default function History() {
  const { tasks } = useTasks();
  const oldTasks = tasks.filter(
    (task) =>
      task.completes.length === task.completes.filter((item) => item).length
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
        maxHeight: "100%",
        minHeight: "100%",
      }}
    >
      <Typography sx={{ display: "flex", alignItems: "center", mt: 2, mx: 2 }}>
        <Info sx={{ mr: 1 }} />
        Tasks are automatically deleted after begin old for 30 days
      </Typography>
      <Day
        title="Old tasks"
        defaultMessage="No old tasks!"
        presetTasks={oldTasks}
      />
    </Box>
  );
}

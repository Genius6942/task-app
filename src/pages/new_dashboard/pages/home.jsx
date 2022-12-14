import { Box, Stack, Typography } from "@mui/material";

import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

import { removeTask, updateTask } from "../../../lib/firebase/firestore/task";
import Task from "../components/task";
import { useTasks } from "../components/task/context";
import { filterDayTask } from "../components/task/transform";

export default function Home() {
  const ogToday = moment().startOf("day");
  const { tasks, fetchTaskUpdate } = useTasks();
  const dayTasks = tasks
    .filter(filterDayTask(ogToday))
    .sort((a, b) => b.status - a.status);
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
          {dayTasks.length > 0 ? (
            dayTasks.map((task, idx) => (
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
            ))
          ) : (
            <Typography>Nothing left for today!</Typography>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}

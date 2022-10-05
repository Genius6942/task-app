import { Box, Stack, Typography } from "@mui/material";

import { AnimatePresence, motion, usePresence } from "framer-motion";
import moment from "moment";

import {
  removeTask,
  updateTask,
} from "../../../../lib/firebase/firestore/task";
import Task from "../../components/task";
import { useTasks } from "../../components/task/context";

/**
 * @param {object} props
 * @param {object} props.task
 */
const MotionContainer = ({ task }) => {
  const [isPresent, safeToRemove] = usePresence();
  const { fetchTaskUpdate } = useTasks();
  return (
    <motion.div
      initial="out"
      animate={isPresent ? "in" : "out"}
      onAnimationComplete={() => !isPresent && safeToRemove()}
      variants={{
        in: { scaleY: 1, opacity: 1 },
        out: { scaleY: 1, opacity: 0 },
      }}
      style={{ position: isPresent ? "static" : "absolute" }}
      transtition={{
        type: "spring",
        stiffness: 500,
        damping: 50,
        mass: 1,
      }}
      layout
    >
      <Task
        layout
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
  );
};

/**
 * @param {object} props
 * @param {moment.Moment} props.day
 */
export default function Day({
  day = moment().startOf("day"),
  presetTasks = null,
  title = null,
}) {
  const { tasks } = useTasks();

  const dayTasks =
    presetTasks ||
    tasks
      .map((task) => ({
        ...task,
        startDate: moment(task.startDate, "MM/DD/YYYY"),
        dueDate: moment(task.dueDate, "MM/DD/YYYY"),
      }))
      .filter((task) => {
        return day.isBetween(task.startDate, task.dueDate, null, "[)");
      });
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography mt={3} fontWeight="bold" fontSize={35} whiteSpace="nowrap">
        {title || day.format("dddd, MM/DD")}
      </Typography>
      <Stack gap={2} my={2}>
        <AnimatePresence>
          {dayTasks.length > 0 ? (
            dayTasks.map((task, idx) => (
              <MotionContainer key={idx} task={task} />
            ))
          ) : (
            <Box sx={{ mb: -4 }}>
              <Typography fontSize={25}>Nothing overdue!</Typography>
            </Box>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}

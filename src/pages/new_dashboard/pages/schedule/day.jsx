import { Box, Stack, Typography } from "@mui/material";

import { AnimatePresence, motion, usePresence } from "framer-motion";
import moment from "moment";

import { taskAnimation } from "../../../../lib/constants";
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
const MotionContainer = ({ task, delay }) => {
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
        delay: delay * taskAnimation.delay,
        duration: taskAnimation.duration,
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
 * @param {moment.Moment?} props.day
 * @param {array[import('../../../../types').task]?} props.presetTasks
 * @param {string?} props.title
 * @param {string?} props.presetMessage
 */
export default function Day({
  day = moment().startOf("day"),
  presetTasks = null,
  title = null,
  defaultMessage = "Nothing for this day.",
}) {
  const { tasks } = useTasks();

  const dayTasks =
    presetTasks ||
    tasks
      .filter((task) => {
        return (
          day.isBetween(task.startDate, task.dueDate, null, "[)") &&
          task.completes.length !=
            task.completes.filter((item) => item).length &&
          task.completes.filter((item) => item).length <
            day.diff(task.startDate, "days") + 1 && 
          task.completes.length - task.completes.filter((item) => item).length >
            day.diff(
              task.startDate.add(
                task.completes.filter((item) => item).length,
                "days"
              ),
              "days"
            )
        );
      })
      .sort((a, b) => {
        if (a.status - b.status !== 0) {
          return b.status - a.status;
        }
        return a.dueDate.diff(b.dueDate, "days");
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
              <MotionContainer key={idx} task={task} delay={idx} />
            ))
          ) : (
            <Box
              sx={{ mb: -4, display: "block", width: "100%" }}
              textAlign="center"
            >
              <Typography textAlign="center" fontSize={25}>
                {defaultMessage}
              </Typography>
            </Box>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}

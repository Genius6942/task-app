import { Stack, Typography } from "@mui/material";

import { motion } from "framer-motion";
import moment from "moment";

import { taskAnimation } from "../../../../lib/constants";
import {
  removeTask,
  updateTask,
} from "../../../../lib/firebase/firestore/task";
import { useSmallScreen } from "../../../../lib/utils";
import Task from "../../components/task";
import { useTasks } from "../../components/task/context";

/**
 * @param {object} props
 * @param {string} props.subject
 */
export default function Subject({ subject, animateDelay }) {
  const { tasks, fetchTaskUpdate } = useTasks();
  const subjectTasks = tasks
    .filter((task) => task.subject === subject)
    .map((task) => ({
      ...task,
      startDate: moment(task.startDate, "MM/DD/YYYY"),
      dueDate: moment(task.dueDate, "MM/DD/YYYY"),
    }));
  const smallScreen = useSmallScreen();
  return (
    <>
      <Typography mt={3} fontWeight="bold" fontSize={35} whiteSpace="nowrap">
        {subject}
      </Typography>
      <Stack gap={2} sx={{ alignItems: "center", overflow: "auto" }}>
        {subjectTasks.length > 0 ? (
          subjectTasks.map((task, idx) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: taskAnimation.duration,
                delay: (animateDelay + idx) * taskAnimation.delay,
              }}
            >
              <Task
                taskData={task}
                customWidth={!smallScreen && 350}
                index={idx}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: taskAnimation.duration,
              delay: animateDelay * taskAnimation.delay,
            }}
          >
            No tasks for this subject!
            {!smallScreen && <Task customWidth={250} placeholder />}
          </motion.div>
        )}
      </Stack>
    </>
  );
}

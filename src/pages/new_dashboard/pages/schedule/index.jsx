import { Box, Stack, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

import { auth } from "../../../../lib/firebase";
import { useSmallScreen } from "../../../../lib/utils";
import { useTasks } from "../../components/task/context";
import { transformTask } from "../../components/task/transform";
import Day from "./day";

export default function Schedule() {
  const { tasks } = useTasks();

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (!user || loading) return;
  });

  /**
   * @param {moment.Moment} day
   */
  const dayInTasks = (day) => {
    return (
      tasks.map(transformTask).filter((task) => {
        return (
          day.isBetween(task.startDate, task.dueDate, null, "[)") &&
          task.completes.length !=
            task.completes.filter((item) => item).length &&
          task.completes.filter((item) => item).length <
            day.diff(task.startDate, "days") + 1
        );
      }).length > 0
    );
  };

  const sorted = tasks.sort((a, b) => a.dueDate.diff(b.dueDate, "days"));
  const days = [];
  let day = moment().startOf("day");
  while (sorted[0] && day.isBefore(sorted.at(-1).dueDate)) {
    days.push(moment(day.format("MM/DD/YYYY"), "MM/DD/YYYY"));
    day = day.add(1, "day");
  }

  const tasksOverdue = tasks.map(transformTask).filter((task) => {
    return (
      task.dueDate.isBefore(moment().startOf("day").add(1, "second")) &&
      task.completes.length !== task.completes.filter((item) => item).length
    );
  });

  const smallScreen = useSmallScreen();
  return (
    <Box
      sx={{
        maxWidth: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack
        gap={2}
        my={2}
        mx={!smallScreen && 2}
        direction={smallScreen ? "column" : "row"}
      >
        <Day
          title="Overdue"
          presetTasks={tasksOverdue}
          defaultMessage={"Nothing overdue!"}
        />
        {days.map((day, idx) => (
          <Day day={day} key={idx} index={idx} />
        ))}
      </Stack>
    </Box>
  );
}

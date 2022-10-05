import { Box, Stack, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

import { auth } from "../../../../lib/firebase";
import { useSmallScreen } from "../../../../lib/utils";
import { useTasks } from "../../components/task/context";
import Day from "./day";

export default function Schedule() {
  const { tasks, fetchTaskUpdate } = useTasks();

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (!user || loading) return;
  });

  /**
   * @param {moment.Moment} day
   */
  const dayInTasks = (day) => {
    return (
      tasks
        .map((task) => ({
          ...task,
          startDate: moment(task.startDate, "MM/DD/YYYY"),
          dueDate: moment(task.dueDate, "MM/DD/YYYY"),
        }))
        .filter((task) => {
          return day.isBetween(task.startDate, task.dueDate, null, "[)");
        }).length > 0
    );
  };

  const days = [];
  let day = moment().startOf("day");
  while (dayInTasks(day)) {
    days.push(moment(day.format("MM/DD/YYYY"), "MM/DD/YYYY"));
    day = day.add(1, "day");
  }

  const tasksOverdue = tasks
    .map((task) => ({
      ...task,
      startDate: moment(task.startDate, "MM/DD/YYYY"),
      dueDate: moment(task.dueDate, "MM/DD/YYYY"),
    }))
    .filter((task) => {
      return (
        task.dueDate.isBefore(moment().startOf("day").format("MM/DD/YYYY")) &&
        task.completes.length === task.completes.filter((item) => item).length
      );
    });

  const smallScreen = useSmallScreen();
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
      <Stack gap={2} my={2} mx={!smallScreen && 2} direction={smallScreen ? "column" : "row"}>
        <Day title="Overdue" presetTasks={tasksOverdue} />
        {days.map((day, idx) => (
          <Day day={day} key={idx} index={idx} />
        ))}
      </Stack>
    </Box>
  );
}

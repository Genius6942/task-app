import { Box, Link, MenuItem, Select, Typography } from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import { useSubjects } from "../../../../components/subjectContext";
import { taskAnimation } from "../../../../lib/constants";
import { useSmallScreen } from "../../../../lib/utils";
import { useTasks } from "../../components/task/context";
import { filterTask, transformTask } from "../../components/task/transform";
import Subject from "./subject";

export default function Subjects() {
  const smallScreen = useSmallScreen();

  const { subjects: loadedSubjects } = useSubjects();
  const subjects = loadedSubjects.map((subject) => subject.name);
  const { tasks } = useTasks();
  const taskCounts = {};
  tasks
    .map(transformTask)
    .filter(filterTask())
    .forEach(
      (task) =>
        (taskCounts[task.subject] = taskCounts[task.subject]
          ? taskCounts[task.subject] + 1
          : 1)
    );
  let taskAnimationCount = 0;

  const [selectedSubject, setSelectedSubject] = useState("all");

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        overflow: "hidden",
        flexDirection: "column",
        gap: 2,
      }}
      className="nobar"
    >
      <Box sx={{ display: "flex", alignItems: "flex-end", mt: 4, mb: -4 }}>
        <Typography fontSize={20} mr={2}>
          Filter subjects:{" "}
        </Typography>
        <Select
          variant="standard"
          value={selectedSubject}
          onChange={({ target }) => setSelectedSubject(target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {loadedSubjects.map((subject) => (
            <MenuItem sx={{ background: subject.color }} value={subject.name}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        sx={{
          maxHeight: "100%",
          width: "100%",
          overflow: "auto",
          p: 6,
          pt: 2,
          display: "flex",
          flexDirection: smallScreen && "column",
          gap: !smallScreen && 3,
        }}
      >
        <AnimatePresence>
          {subjects.length > 0 ? (
            subjects
              .filter(
                (subject) =>
                  selectedSubject === "all" || subject === selectedSubject
              )
              .map((subject, idx) => {
                taskAnimationCount +=
                  taskCounts[subject] || taskAnimation.delay;
                return (
                  <motion.div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay:
                        (taskAnimationCount - (taskCounts[subject] || 0)) *
                        taskAnimation.delay,
                      duration: taskAnimation.duration,
                    }}
                  >
                    <Subject
                      subject={subject}
                      animateDelay={taskAnimationCount - taskCounts[subject]}
                    />
                  </motion.div>
                );
              })
          ) : (
            <Typography mx="auto">
              No subjects! Create one on your{" "}
              <Link
                href="/dashboard/account"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("../account");
                }}
              >
                account page.
              </Link>
            </Typography>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

import { Box, Link, Typography } from "@mui/material";

import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import { taskAnimation } from "../../../../lib/constants";
import { auth } from "../../../../lib/firebase";
import { getUser } from "../../../../lib/firebase/firestore/user";
import { useSmallScreen } from "../../../../lib/utils";
import { useTasks } from "../../components/task/context";
import { filterTask, transformTask } from "../../components/task/transform";
import Subject from "./subject";

export default function Subjects() {
  const smallScreen = useSmallScreen();
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      const { subjects: loadedSubjects } = await getUser(user.uid);
      setSubjects(loadedSubjects.map((subject) => subject.name));
    })();
  }, [user, loading]);

  /**
   * @type {[string[], (value: string[]) => void]}
   */
  const [subjects, setSubjects] = useState([]);
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

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        overflow: "hidden",
        gap: 2,
      }}
      className="nobar"
    >
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
            subjects.map((subject, idx) => {
              taskAnimationCount += taskCounts[subject] || taskAnimation.delay;
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

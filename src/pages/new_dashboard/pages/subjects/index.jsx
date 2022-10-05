import { Box, Typography } from "@mui/material";

import { LegendToggleOutlined } from "@mui/icons-material";

import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { AnimatePresence, motion } from "framer-motion";

import { taskAnimation } from "../../../../lib/constants";
import { auth } from "../../../../lib/firebase";
import { getUser } from "../../../../lib/firebase/firestore/user";
import { useSmallScreen } from "../../../../lib/utils";
import { useTasks } from "../../components/task/context";
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
  tasks.forEach(
    (task) =>
      (taskCounts[task.subject] = taskCounts[task.subject]
        ? taskCounts[task.subject] + 1
        : 1)
  );
  let taskAnimationCount = 0;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        overflow: "hidden",
        gap: 2,
      }}
    >
      <Box
        sx={{
          maxHeight: "100%",
          width: "100%",
          overflow: "auto",
          p: 6,
          display: "flex",
          flexDirection: smallScreen && "column",
          gap: !smallScreen && 3,
        }}
      >
        <AnimatePresence>
          {subjects.map((subject, idx) => {
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
          })}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

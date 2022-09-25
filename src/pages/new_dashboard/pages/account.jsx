import {
  Avatar,
  Box,
  Stack,
  Typography,
  useTheme,
  Chip,
  IconButton,
  Dialog,
  TextField,
  styled,
  Button,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { app_name } from "../../../lib/constants";
import { auth } from "../../../lib/firebase";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import { useSmallScreen } from "../../../lib/utils";

const MobileDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    position: "absolute",
    margin: 0,
    width: "100%",
    bottom: 0,
  },
}));

export default function Account() {
  const [user, loading, error] = useAuthState(auth);
  // useEffect(() => {}, [user, loading]);

  const theme = useTheme();

  const [subjects, setSubjects] = useState([
    {
      id: 0,
      name: "Math",
      selected: true,
    },
  ]);

  const updateChip = (id, newValue) => {
    const copy = [...subjects];
    const idx = copy.findIndex(({ id: subjectId }) => subjectId === id);
    if (!newValue) {
      copy.splice(idx, 1);
    } else {
      copy[idx] = newValue;
    }
    setSubjects(copy);
    return;
  };

  const smallScreen = useSmallScreen();
  const AddSubjectDialog = smallScreen ? MobileDialog : Dialog;

  const settings = [
    {
      name: "Subjects",
      component: (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {subjects.map((subject, idx) => (
            <Chip
              key={idx}
              sx={{
                background: `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                transition: theme.transitions.create("all", {
                  duration: theme.transitions.duration.medium,
                }),
                // py: 2,
                borderRadius: 9999,
                border: subject.selected
                  ? "5px solid white"
                  : "0px solid white",
                ":hover": {
                  boxShadow: "5px 10px 12px 0px rgba(0,0,0,0.3)",
                },
                ":focus": {
                  boxShadow: "5px 10px 12px 0px rgba(0,0,0,0.3)",
                },
              }}
              label={subject.name}
              onClick={() =>
                updateChip(subject.id, {
                  ...subject,
                  selected: !subject.selected,
                })
              }
              onDelete={() => updateChip(subject.id, null)}
            />
          ))}
          <IconButton sx={{ py: 0, px: 0.4 }}>
            <Add />
          </IconButton>
          <AddSubjectDialog open={true}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <TextField
                variant="standard"
                sx={{ m: 2, mb: 1, flexGrow: 1 }}
                autoFocus={true}
                label="New Subject"
              />
              <Button variant="text">Add</Button>
            </Box>
          </AddSubjectDialog>
        </Box>
      ),
    },
    {
      name: "subjects",
    },
    {
      name: "subjects",
    },
    {
      name: "subjects",
    },
    {
      name: "subjects",
    },
    {
      name: "subjects",
    },
    {
      name: "subjects",
    },
    {
      name: "subjects",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "scroll",
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            borderBottom: "3px solid black",
          }}
        >
          <Typography fontSize={30} mr={3}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              Welcome,{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {user ? user.displayName : app_name + "user"}.
            </motion.span>
          </Typography>
          <Avatar
            alt={user && user.displayName}
            src={user && user.photoURL}
            sx={{ mb: 1 }}
          >
            {user && !user.photoURL && user.displayName}
          </Avatar>
        </Box>
        <Stack gap={4} mt={3} width="100%">
          {settings.map((setting, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 * idx }}
            >
              <Box
                sx={{
                  p: 2,
                  wdith: "100%",
                  borderRadius: 5,
                  background: theme.palette.grey[300],
                }}
              >
                <Typography fontWeight="bold">{setting.name}</Typography>
                {setting.component}
              </Box>
            </motion.div>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

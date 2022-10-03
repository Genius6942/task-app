import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";

// import { styled } from "@mui/material/styles";

import { Add } from "@mui/icons-material";

import { useState } from "react";
import { useEffect } from "react";

import { shadeColor } from "../../../../lib/lightenColor";
import { useSmallScreen } from "../../../../lib/utils";

const MobileDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    position: "absolute",
    margin: 0,
    width: "100%",
    bottom: 0,
  },
}));

export default function Subjects({ subjects, updateSubjects }) {
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);

  const updateSubject = (id, newValue) => {
    const copy = [...subjects];
    const idx = copy.findIndex(({ id: subjectId }) => subjectId === id);
    if (!newValue) {
      copy.splice(idx, 1);
    } else {
      copy[idx] = newValue;
    }
    updateSubjects(copy);
    return;
  };

  const addSubject = (name) => {
    const copy = [...subjects];

    const newSubject = {
      name,
      id: Math.max(...subjects.map((subject) => subject.id), 0) + 1,
      selected: true,
    };

    copy.push(newSubject);

    updateSubjects(copy);
  };

  const [dialogValue, setDialogValue] = useState("");
  const [dialogError, setDialogError] = useState(false);

  const smallScreen = useSmallScreen();
  const AddSubjectDialog = smallScreen ? MobileDialog : Dialog;

  const submitDialog = (value) => {
    if ((value || dialogValue).length < 1) {
      setDialogError("Name Required");
    } else if (
      subjects.map((subject) => subject.name).includes(value || dialogValue)
    ) {
      setDialogError("Subject already exists");
    } else {
      addSubject(value || dialogValue);
      setDialogError(false);
      setDialogValue("");
      setDialogOpen(false);
    }
  };

  return (
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
            ":hover": {
              boxShadow: "5px 10px 12px 0px rgba(0,0,0,0.3)",
            },
            ":focus": {
              boxShadow: "5px 10px 12px 0px rgba(0,0,0,0.3)",
            },
          }}
          label={subject.name}
          onDelete={() => updateSubject(subject.id, null)}
        />
      ))}
      <IconButton sx={{ py: 0, px: 0.4 }} onClick={() => setDialogOpen(true)}>
        <Add />
      </IconButton>
      <AddSubjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Box sx={{ display: "flex", alignItems: "flex-end", m: 1 }}>
          <TextField
            error={dialogError}
            helperText={dialogError}
            variant="standard"
            sx={{ flexGrow: 1 }}
            autoFocus={dialogOpen}
            label="New Subject"
            onBlur={({ target }) => {
              setDialogValue(target.value);
            }}

            // broken
            // onKeyDown={({ key, target }) => {
            //   if (key === "Enter") {
            //     submitDialog(target.value);
            //   }
            // }}
          />
          <Button
            variant="text"
            onClick={() => {
              submitDialog();
            }}
          >
            Add
          </Button>
          <Button variant="text" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
        </Box>
      </AddSubjectDialog>
    </Box>
  );
}

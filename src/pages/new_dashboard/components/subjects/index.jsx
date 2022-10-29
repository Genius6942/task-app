import { styled } from "@mui/material/styles";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";

import { Add, HighlightOff } from "@mui/icons-material";

import { useState } from "react";

import { useSmallScreen } from "../../../../lib/utils";

const MobileDialog = styled(Dialog)(() => ({
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

  const addSubject = (name, color) => {
    const copy = [...subjects];

    const newSubject = {
      name,
      color,
      id: Math.max(...subjects.map((subject) => subject.id), 0) + 1,
      selected: true,
    };

    copy.push(newSubject);

    updateSubjects(copy);
  };

  const gradients = ["#FDDFDF", "#FCF7DE", "#DEFDE0", "#DEF3FD", "#F0DEFD"];
  const [dialogValue, setDialogValue] = useState("");
  const [dialogError, setDialogError] = useState(false);
  const [dialogColor, setDialogColor] = useState(gradients[0]);

  const smallScreen = useSmallScreen();
  const AddSubjectDialog = smallScreen ? MobileDialog : Dialog;

  const submitDialog = (value, color) => {
    console.log(color);
    if ((value || dialogValue).length < 1) {
      setDialogError("Name Required");
    } else if (
      subjects.map((subject) => subject.name).includes(value || dialogValue)
    ) {
      setDialogError("Subject already exists");
    } else {
      addSubject(value || dialogValue, color);
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
            background:
              (subject.color !== "default" && subject.color) ||
              `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
            color: "black !important",
            "& .MuiChip-deleteIcon": {
              color: "black !important",
            },
          }}
          deleteIcon={<HighlightOff />}
          label={subject.name}
          onDelete={() => updateSubject(subject.id, null)}
        />
      ))}
      <IconButton sx={{ py: 0, px: 0.4 }} onClick={() => setDialogOpen(true)}>
        <Add />
      </IconButton>
      <AddSubjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>New Subject</DialogTitle>
        <Box
          sx={{ display: "flex", alignItems: "flex-end", m: 1 }}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            submitDialog(data.get("name"), data.get("color"));
          }}
        >
          <TextField
            error={!!dialogError}
            helperText={dialogError}
            variant="standard"
            sx={{ flexGrow: 1 }}
            autoFocus={dialogOpen}
            label="Name"
            name="name"
            onBlur={({ target }) => {
              setDialogValue(target.value);
            }}
          />
          <Select
            name="color"
            value={dialogColor}
            onChange={({ target }) => setDialogColor(target.value)}
            sx={{
              ml: 2,
              color: "black",
              background:
                dialogColor === "default"
                  ? `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                  : dialogColor,
            }}
          >
            {gradients.map((gradient, idx) => (
              <MenuItem
                key={idx}
                value={gradient}
                sx={{
                  background:
                    gradient === "default"
                      ? `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                      : gradient,
                }}
              >
                color {idx + 1}
              </MenuItem>
            ))}
          </Select>
          <Button variant="text" type="submit">
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

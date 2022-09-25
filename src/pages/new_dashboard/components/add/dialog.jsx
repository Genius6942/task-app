import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Chip,
  Box,
  useTheme,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";

import { useState } from "react";

import { Add, Delete } from "@mui/icons-material";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";

import { useSmallScreen } from "../../../../lib/utils";

const DatePicker = (props) =>
  props.mobile ? (
    <MobileDatePicker {...props} />
  ) : (
    <DesktopDatePicker {...props} />
  );

/**
 *
 * @param {object} props
 * @param {() => void} onClose - function to call when dialog closed
 * @param {boolean} open - whether or not the dialog is open
 * @returns
 */
export default function AddTaskDialog({ onClose, open }) {
  const theme = useTheme();
  const addField = ({ id }) => {
    return () => {
      setFields([...fields, id]);
    };
  };

  const [fields, setFields] = useState([]);
  const removeField = (id) => {
    const copy = [...fields];
    copy.splice(
      copy.findIndex(({ id: fieldId }) => fieldId === id),
      1
    );
    setFields(copy);
  };

  const smallScreen = useSmallScreen();

  const [data, setData] = useState({
    title: "",
  });

  const chips = [
    {
      name: "Due date",
      id: 0,
      field: (
        <DatePicker
          mobile={smallScreen}
          label="Start Date"
          inputFormat="MM/DD/YYYY"
          value={moment()}
          onChange={(newValue) => console.log(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      ),
    },
    {
      name: "Details",
      field: (
        <TextField
          autoFocus
          margin="dense"
          id="details"
          label="details"
          fullWidth
          variant="standard"
        />
      ),
      id: 1,
    },
    {
      name: "Time length",
      field: (
        <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
          <TextField
            variant="standard"
            defaultValue={1}
            sx={{ width: 42 }}
            type="number"
            InputProps={{ inputProps: { min: 0, max: 59 } }}
          />
          <Typography>hours</Typography>
          <TextField
            variant="standard"
            defaultValue={0}
            sx={{ width: 42 }}
            type="number"
            InputProps={{ inputProps: { min: 0, max: 59 } }}
          />
          <Typography>minutes.</Typography>
        </Box>
      ),
      id: 2,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Task Name"
          fullWidth
          variant="standard"
          onBlur={() => setData()}
        />
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {chips.map(
            (chip, idx) =>
              fields.findIndex((fieldId) => fieldId === chip.id) === -1 && (
                <Chip
                  sx={{
                    background: `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    transition: theme.transitions.create("all", {
                      duration: theme.transitions.duration.medium,
                    }),
                    ":hover": {
                      boxShadow: "5px 10px 12px 0px rgba(0,0,0,0.3)",
                      // right: '2px',
                      // bottom: '2px',
                    },
                    ":focus": {
                      boxShadow: "5px 10px 12px 0px rgba(0,0,0,0.3)",
                      // right: '2px',
                      // bottom: '2px',
                    },
                  }}
                  label={chip.name}
                  key={idx}
                  onClick={addField({ id: chip.id })}
                  onDelete={addField({ id: chip.id })}
                  deleteIcon={<Add />}
                />
              )
          )}
        </Box>
        <Stack gap={2} sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            {fields.map(
              /**
              @param {number} id
            */
              (id) => {
                const field = chips.find(({ id: fieldId }) => id === fieldId);
                return (
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                    {field.field}
                    <IconButton onClick={() => removeField(field.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                );
              }
            )}
          </LocalizationProvider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

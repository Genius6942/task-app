import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { Add, Delete } from "@mui/icons-material";

import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useState } from "react";
import { useEffect } from "react";

import moment from "moment";

import { useForceUpdate, useSmallScreen } from "../../../../lib/utils";

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
 * @param {object} onSubmit
 * @returns
 */
export default function AddTaskDialog({ onClose, open, subjects, onSubmit }) {
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

    chips.find(({ id: fieldId }) => fieldId === id).remove();
    setFields(copy);
  };

  const [timeForceUpdate, forceTimeUpdate] = useForceUpdate();

  const smallScreen = useSmallScreen();

  const chips = [
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
          onBlur={({ target }) => updateData({ details: target.value })}
        />
      ),
      id: 0,
      remove: () => updateData({ details: "" }),
    },
  ];

  useEffect(() => {
    subjects && subjects[0] && updateData({ subject: subjects[0].name });
  }, [subjects]);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  /**
   * @param {Partial<data>} data
   */
  const updateData = ({ ...values }) => {
    return setData({ ...data, ...values });
  };
  const [data, setData] = useState({
    subject: "",
    name: "",
    startDate: moment().startOf("day"),
    dueDate: moment().add(1, "days"),
    time: 60,
    details: "",
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DialogTitle>Create Task</DialogTitle>
        {subjects ? (
          subjects[0] ? (
            <>
              <DialogContent>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <Typography>Subject: </Typography>
                  <Select
                    value={data.subject}
                    label="Subject"
                    variant="standard"
                    onChange={({ target }) => {
                      updateData({ subject: target.value });
                    }}
                  >
                    {subjects.map((subject, idx) => (
                      <MenuItem value={subject.name} key={idx}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Stack gap={2} mb={2}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="task-name"
                    label="Task Name"
                    fullWidth
                    variant="standard"
                    onBlur={({ target }) => updateData({ name: target.value })}
                  />
                  <DatePicker
                    mobile={smallScreen}
                    label="Due Date"
                    inputFormat="MM/DD/YYYY"
                    value={data.dueDate}
                    onChange={(newValue) => updateData({ dueDate: newValue })}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                    <TextField
                      key={timeForceUpdate}
                      variant="standard"
                      defaultValue={Math.floor(data.time / 60)}
                      sx={{ width: 42 }}
                      type="number"
                      autoComplete="off"
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                      onBlur={({ target }) => {
                        const value =
                          target.value.length === 0
                            ? 0
                            : parseInt(target.value);
                        updateData({
                          time: value * 60 + (data.time % 60),
                        });

                        forceTimeUpdate();
                      }}
                    />
                    <Typography>hours</Typography>
                    <TextField
                      key={timeForceUpdate + 10 ** 6}
                      variant="standard"
                      defaultValue={data.time % 60}
                      sx={{ width: 42 }}
                      type="number"
                      autoComplete="off"
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                      onBlur={({ target }) => {
                        const value =
                          target.value.length === 0
                            ? 0
                            : parseInt(target.value);
                        updateData({
                          time: value + Math.floor(data.time / 60) * 60,
                        });

                        forceTimeUpdate();
                      }}
                    />
                    <Typography>minutes</Typography>
                  </Box>
                </Stack>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {chips.map(
                    (chip, idx) =>
                      fields.findIndex((fieldId) => fieldId === chip.id) ===
                        -1 && (
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
                  {fields.map(
                    /**
											@param {number} id
										*/
                    (id, idx) => {
                      const field = chips.find(
                        ({ id: fieldId }) => id === fieldId
                      );
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 2,
                          }}
                          key={idx}
                        >
                          {field.field}
                          <IconButton onClick={() => removeField(field.id)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      );
                    }
                  )}
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  onClick={async () => {
                    await onSubmit(data);
                    onClose();
                  }}
                >
                  Create
                </Button>
              </DialogActions>
            </>
          ) : (
            <Typography m={2}>
              Go to accounts to add a subject and get started.
            </Typography>
          )
        ) : (
          <CircularProgress />
        )}
        <Dialog
          open={errorDialogOpen}
          onClose={() => setErrorDialogOpen(false)}
        >
          <DialogTitle>
            Name, Subject, Date, and time length required
          </DialogTitle>
          <DialogActions>
            <Button variant="text" onClick={() => setErrorDialogOpen(false)}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Dialog>
  );
}

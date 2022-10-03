import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// mui
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useEffect, useState } from "react";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {(data: object) => void} props.onClose
 * @param {object} props.defaults
 * @param {string[]} props.categories
 * @param {(data: object) => void} props.onSubmit
 */
export default function AddCardModal({
  open,
  onClose,
  defaults,
  categories,
  onSubmit,
}) {
  const [data, setData] = useState(defaults);

  useEffect(() => {
    // only allow change when modal not open
    if (!open) {
      setData(defaults);
    } else {
      // only override category
      setData({ ...data, category: defaults.category });
    }
  }, [defaults]);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Dialog open={open} onClose={() => onClose()}>
        <Box sx={{ padding: 3 }}>
          <DialogTitle>Create New Task</DialogTitle>
          <FormControl variant="outlined">
            <Typography>Select a parent category</Typography>
            <Select
              id="category-select"
              autoWidth
              value={data.category}
              sx={{ marginY: 2 }}
              onChange={({ target }) =>
                setData({ ...data, category: target.value })
              }
            >
              {categories.map((item, idx) => (
                <MenuItem value={item} key={idx}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            <TextField
              sx={{ marginY: 2 }}
              label="Title"
              multiline
              value={data.title}
              onChange={({ target }) => {
                setData({ ...data, title: target.value });
              }}
            ></TextField>
            <TextField
              sx={{ marginY: 2 }}
              label="Task content"
              multiline
              value={data.text}
              onChange={({ target }) => {
                setData({ ...data, text: target.value });
              }}
            ></TextField>
            <DateTimePicker
              label="Finish by date"
              value={data.time}
              onChange={(newTime) => setData({ ...data, time: newTime })}
              renderInput={(props) => (
                <TextField
                  {...props}
                  sx={{ ...props.sx, marginY: 2, marginBottom: 4 }}
                />
              )}
            />
            <Button
              variant="contained"
              onClick={() => {
                onClose();
                onSubmit(data);
              }}
            >
              Add task
            </Button>
          </FormControl>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
}

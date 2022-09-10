import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  TextField,
  Box,
  Dialog,
  DialogTitle,
  Button,
  Container,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import moment from "moment";
import { useState, useEffect } from "react";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {(data: object) => void} props.onClose
 * @param {object} props.defaults
 * @param {string[]} props.categories
*/
export default function AddCardModal({
  open,
  onClose,
  defaults,
  categories,
}) {
  const [data, setData] = useState(defaults);

  useEffect(() => {
    setData(defaults);
  }, [defaults]);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Dialog open={open} onClose={() => onClose(value)}>
        <Box sx={{ padding: 3 }}>
          <DialogTitle>Create New Task</DialogTitle>
          <FormControl variant="outlined">
            <Select
              autoWidth
              value={data.category}
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
              sx={{ marginY: 4 }}
              label="Task"
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
                <TextField {...props} sx={{ ...props.sx, marginY: 4 }} />
              )}
            />
            <Button variant="contained" fullWidth={true} onClick={() => onClose(data)}>
              Add task
            </Button>
          </FormControl>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
}

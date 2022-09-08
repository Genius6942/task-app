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

export default function AddCardModal({
  open,
  value,
  onClose,
  categories,
  defaultCategory,
}) {
  const [currentTime, setCurrentTime] = useState(value);
  const [category, setCategory] = useState(defaultCategory);

  useEffect(() => {
    setCurrentTime(value);
  }, [value]);
  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Dialog open={open} onClose={() => onClose(value)}>
        <Box sx={{ padding: 3 }}>
          <DialogTitle>Create New Task</DialogTitle>
          <FormControl variant="outlined">
            <Select
              autoWidth
              value={category}
              onChange={({ target }) => setCategory(target.value)}
            >
              {categories.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
            <DateTimePicker
              label="Finish by date"
              value={currentTime}
              onChange={(newTime) => setCurrentTime(newTime)}
              renderInput={(props) => (
                <TextField {...props} sx={{ ...props.sx, margin: 4 }} />
              )}
            />
            <Button variant="contained" fullWidth={true}>
              Add task
            </Button>
          </FormControl>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
}

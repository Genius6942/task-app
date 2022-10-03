// mui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

// react
import { useEffect, useState } from "react";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {(data: object) => void} props.onClose
 * @param {object} props.defaults
 * @param {(data: object) => void} props.onSubmit
 */
export default function AddColModal({ open, onClose, defaults, onSubmit }) {
  const [data, setData] = useState(defaults);

  useEffect(() => {
    // only allow change when modal not open
    if (!open) {
      setData(defaults);
    }
  }, [defaults]);
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <Box sx={{ padding: 3 }}>
        <DialogTitle>Create New Category</DialogTitle>
        <FormControl variant="outlined">
          <TextField
            sx={{ marginY: 2 }}
            label="Title"
            value={data.title}
            onChange={({ target }) => {
              setData({ ...data, title: target.value });
            }}
            autoFocus={open}
          ></TextField>

          <Button
            variant="contained"
            onClick={() => {
              onClose();
              onSubmit(data);
            }}
          >
            Create category
          </Button>
        </FormControl>
      </Box>
    </Dialog>
  );
}

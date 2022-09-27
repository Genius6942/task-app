import { Close, Edit, Save } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function EditableInfo({ data, fields, updateData }) {
  const [editing, setEditing] = useState(false);
  return (
    <Box>
      <Stack>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);

            const copy = { ...data };

            fields.forEach(({ key }) => (copy[key] = formData.get(key)));

            updateData(copy);

            setEditing(false);
          }}
        >
          {fields.map((field, idx) => (
            <Box sx={{ display: "flex", alignItems: "flex-end" }} key={idx}>
              <Typography fontWeight="bold" mr={1}>
                {field.name}:
              </Typography>
              {editing ? (
                <TextField
                  variant="standard"
                  name={field.key}
                  defaultValue={data[field.key]}
                />
              ) : (
                <Typography>{data[field.key]}</Typography>
              )}
            </Box>
          ))}
          <Box sx={{ display: "flex", mb: -1 }}>
            {!editing ? (
              <Tooltip title="Edit">
                <IconButton onClick={() => setEditing(true)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="Cancel">
                  <IconButton onClick={() => setEditing(false)}>
                    <Close />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save" type="submit">
                  <IconButton>
                    <Save />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </form>
      </Stack>
    </Box>
  );
}

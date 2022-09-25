import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import AddTaskDialog from "./dialog";
import { useForceUpdate } from "../../../../lib/utils";

export default function AddButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        <Add />
      </Fab>
      <AddTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}

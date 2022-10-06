import { Box, IconButton, Typography } from "@mui/material";

import { InfoOutlined as Info } from "@mui/icons-material";

import Day from "./schedule/day";

export default function History() {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton><Info sx={{ mt: 2, mr: 1 }} /></IconButton>
        <Typography>
          Tasks are automatically deleted after begin old for 30 days
        </Typography>
      </Box>
      <Day title="Old tasks" />
    </Box>
  );
}

import { Box } from "@mui/material";
import { useState } from "react";
import Task from "../components/task";

export default function Home() {
  const [taskState, setTaskState] = useState({
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus modi et, vitae sint perspiciatis qui hic, eius aperiam adipisci quos ex veniam officia odit accusamus cumque dicta eaque earum at!",
    color: "#8ED1FC",
  });
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Task data={taskState} onChange={(data) => setTaskState(data)} />
    </Box>
  );
}

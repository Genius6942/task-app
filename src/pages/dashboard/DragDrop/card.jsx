import {
  Delete,
  DeleteForever,
  DeleteOutline,
  Edit,
} from "@mui/icons-material";
import { CardActions, CardContent, IconButton, Card, Box } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";

/**
 * @param {Object} props
 * @param {{ id: number; text: string }} props.data
 */
export default function TaskCard({ data }) {
  return (
    <Draggable draggableId={data.id.toString()} index={data.id}>
      {(provided, snapshot) => (
        <Box
          sx={{ padding: 3 }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Card sx={{ width: 275 }}>
            <CardActions disableSpacing>
              <Box sx={{ display: "flex", justifyItems: "flex-end" }}>
                <IconButton>
                  <Edit></Edit>
                </IconButton>
                <IconButton>
                  <Delete></Delete>
                </IconButton>
              </Box>
            </CardActions>
            <CardContent>{data.text}</CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
}

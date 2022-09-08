import { ColorLens, Delete, Edit, DragIndicator } from "@mui/icons-material";
import {
  CardActions,
  CardContent,
  IconButton,
  Card,
  Box,
  Typography,
} from "@mui/material";
import { color, Container } from "@mui/system";
import { Draggable } from "react-beautiful-dnd";
import { TwitterPicker } from "react-color";
import { useState } from "react";

/**
 * @param {Object} props
 * @param { import('../types').cardState } props.data
 * @param {(newState: import('../types').cardState ) => void} props.onChange
 * @param {boolean} props.placeholder - makes the card invisible and not interactive
 */
export default function TaskCard({
  data,
  index,
  onChange,
  placeholder = false,
}) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  /**
   * @param {import('react-color').ColorResult} color
   */
  const onColorChange = (color) => {
    const shallowCopy = { ...data };
    data.color = color.hex;
    onChange(data);
  };
  if (placeholder) {
    return <div style={{ width: 398, height: 161 }}></div>;
  }

  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Box
          sx={{ padding: 3 }}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Card sx={{ width: 350, backgroundColor: data.color || "#cccccc", overflow: 'visible' }}>
            <CardActions disableSpacing>
              <Container
                sx={{ display: "flex" }}
                // override container padding
                style={{ padding: 0 }}
                maxWidth="lg"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                  {...provided.dragHandleProps}
                >
                  <DragIndicator
                    fontSize="large"
                    sx={{ transform: "rotate(90deg) translateX(3px)" }}
                  ></DragIndicator>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton
                    sx={{ position: "relative" }}
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                  >
                    <ColorLens />
                    {colorPickerOpen ? (
                      <Box
                        sx={{ position: "absolute", top: "110%", right: "0" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TwitterPicker
                          color={data.color}
                          triangle="top-right"
                          onChangeComplete={onColorChange}
                        />
                      </Box>
                    ) : null}
                  </IconButton>
                  <IconButton onClick={() => onChange(null)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Container>
            </CardActions>
            <CardContent>
              <Typography>{data.text}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
}

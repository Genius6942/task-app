import { ColorLens, Delete, Edit, DragIndicator } from "@mui/icons-material";
import {
  CardActions,
  CardContent,
  IconButton,
  Card,
  Box,
  Typography,
  Link,
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
export default function TaskCard({ data, index, onChange, placeholder = false }) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  /**
   * @param {import('react-color').ColorResult} color
   */
  const onColorChange = color => {
    const shallowCopy = { ...data };
    data.color = color.hex;
    onChange(data);
  };
  if (placeholder) {
    return <div style={{ width: 398, height: 161 }}></div>;
  }

  const text = data.text;
  const regexp = /(https?:\/\/[^\s]+)/g;

  const result = Array.from(text.matchAll(regexp), m => m[0]);

  const output = text.split(regexp).filter(item => !regexp.test(item));

  Array(result.length)
    .fill()
    .forEach((_, idx) => {
      output.splice(
        result.length - idx,
        0,
        <Link href={result[result.length - idx - 1]} target="_blank" rel="noopener">
          {result[result.length - idx - 1]}
        </Link>
      );
    });

  const finalText = output.map((item, idx) => <span key={idx}>{item}</span>);

  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Box sx={{ padding: 3, paddingBottom: data.time ? 0 : null }} {...provided.draggableProps} ref={provided.innerRef}>
          <Card
            sx={{
              width: 350,
              backgroundColor: data.color || "#cccccc",
              overflow: "visible",
            }}
          >
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
                        onClick={e => e.stopPropagation()}
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
              <Typography whiteSpace="pre-wrap" textOverflow="ellipsis">{output}</Typography>
              <Typography whiteSpace="pre-wrap" textOverflow="ellipsis" fontSize={10}>{data.time}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
}

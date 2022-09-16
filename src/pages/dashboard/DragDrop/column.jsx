import { Draggable, Droppable } from "react-beautiful-dnd";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Toolbar'

// material icons
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import ColorLens from '@mui/icons-material/ColorLens';
import Add from '@mui/icons-material/Add';

// custom
import { shadeColor } from "./lightenColor";
import { useSmallScreen } from "../../../lib/utils";
import TaskCard from "./card";

// react
import { useState } from "react";
import { TwitterPicker } from "react-color";
import { useWindowSize } from "react-use";

/**
 *
 * @param {Object} props
 * @param {number} props.index
 * @param {import('../types').colState} props.data
 * @param {(newState: import('../types').colState) => void} props.onColChange
 * @param {(newState: import('../types').cardState, cardIdx: number) => void} props.onCardChange
 * @param {() => void} props.onAdd
 * @returns
 */
export default function Column({
  data,
  index,
  onColChange = () => {},
  onCardChange = () => {},
  onAdd = () => {},
}) {
	const { width, height } = useWindowSize();

  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  /**
   * @param {import('react-color').ColorResult} color
   */
  const onColorChange = (color) => {
    const shallowCopy = { ...data };
    shallowCopy.color = color.hex;
    onColChange(shallowCopy);
  };

	const margin = 20;

  const smallScreen = useSmallScreen();

  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {(provided, snapshot) => (
        // card has issues ngl
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            margin: smallScreen ? `${margin}px 0` : `${margin}px`,
            display: "inline-block",
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
            overflow: "visible",
						maxWidth: `${width - margin * 2}px`,
          }}
        >
          {/* header */}
          <Box
            sx={{
              backgroundColor: data.color || '#bbbbbb',
              zIndex: 1,
              position: "relative",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <CardActions
              style={{
                padding: 10,
                backdropFilter: snapshot.isDragging
                  ? "brightness(.8)"
                  : "brightness(1)",
                transition: "backdrop-filter .2s ease",
              }}
              {...provided.dragHandleProps}
            >
              {/* title */}
              <Box style={{ display: "flex", flexGrow: 1 }}>
                <Typography fontSize={20}>{data.title}</Typography>
              </Box>

              {/* icons */}
              <Tooltip title="Add">
                <IconButton onClick={() => onAdd(data.title)}>
                  <Add />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Color">
                <IconButton
                  onClick={() => setColorPickerOpen(!colorPickerOpen)}
                >
                  <ColorLens />
                  {colorPickerOpen ? (
                    <Box
                      sx={{ position: "absolute", top: "110%", right: "0" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TwitterPicker
                        color={data.color || "#bbbbbb"}
                        triangle="top-right"
                        onChangeComplete={onColorChange}
                      />
                    </Box>
                  ) : null}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => onColChange(null)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Box>
          {/* content */}
          <Droppable droppableId={data.id.toString()} type="CARD">
            {(provided, snapshot) => (
              <Box
                sx={{
                  backgroundColor: snapshot.isDraggingOver
                    ? shadeColor(data.color || "#bbbbbb", -20)
                    : shadeColor(data.color || "#bbbbbb", 20),
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "background-color .2s ease",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
                style={{ minHeight: 201, maxWidth: `${width - margin * 2}px` }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <CardContent
                  style={{ position: "relative" }}
                  // class="col-backdrop-container"
                >
                  <Box>
                    {data.items.length > 0
                      ? data.items.map((item, index) => (
                          <TaskCard
                            key={item.id.toString()}
                            data={item}
                            index={index}
                            onChange={(data) => onCardChange(data, index)}
                          />
                        ))
                      : !snapshot.isDraggingOver && (
                          <Typography fontSize={20}>
                            Create or drag and drop a task to get started.
                          </Typography>
                        )}
                    {provided.placeholder}
                  </Box>
                </CardContent>
              </Box>
            )}
          </Droppable>
        </Card>
      )}
    </Draggable>
  );
}

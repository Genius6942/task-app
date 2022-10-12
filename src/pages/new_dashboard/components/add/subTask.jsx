import { Box, IconButton, TextField, Typography } from "@mui/material";

import { Add, DragIndicator, Remove } from "@mui/icons-material";

import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

/**
 * @param {object} props
 * @param {{id: number, text: string}[]} props.subTasks
 * @param {(newSubTasks: {id: number, text: string}[]) => void} props.onChange
 */
export default function SubTaskEditor({ subTasks, onChange }) {
  const [{ adding, key, text }, setAdding] = useState({
    adding: false,
    key: 0,
    text: "",
  });

  /**
   * @param {import('react-beautiful-dnd').DropResult} result
   * @param {import('react-beautiful-dnd').ResponderProvided} provided
   */
  const onDragEnd = ({ source, destination }, provided) => {
    const copy = [...subTasks];
    const [item] = copy.splice(source.index, 1);
    copy.splice(destination.index, 0, item);
    onChange(copy);
  };

  const generateSubtaskId = () =>
    Math.max(...subTasks.map((item) => item.id), 0) + 1;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography mr="auto">Sub Tasks</Typography>
          <IconButton
            onClick={() => {
              if (adding) {
                onChange([
                  ...subTasks,
                  { id: generateSubtaskId, text, completed: false },
                ]);
                setAdding({ adding: true, key: key + 1, text: "" });
              }
              setAdding({ adding: true, key: key + 1, text });
            }}
          >
            <Add />
          </IconButton>
        </Box>
        <Droppable droppableId="subtasks">
          {(provided, snapshot) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {subTasks.map((subTask, idx) => (
                <Draggable
                  draggableId={subTask.id.toString()}
                  index={idx}
                  key={subTask.id}
                >
                  {(provided, snapshot) => (
                    <Box
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <span {...provided.dragHandleProps}>
                        <DragIndicator />
                      </span>
                      <IconButton
                        onClick={() => {
                          const copy = [...subTasks];
                          copy.splice(idx, 1);
                          onChange(copy);
                        }}
                      >
                        <Remove />
                      </IconButton>
                      <Typography>{subTask.text}</Typography>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        {adding && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => setAdding({ adding: false, key: key + 1, text })}
            >
              <Remove />
            </IconButton>
            <TextField
              key={key}
              variant="standard"
              autoFocus
              defaultValue={""}
              onChange={({ target }) =>
                setAdding({ adding, key, text: target.value })
              }
              onKeyDown={({ key, target }) => {
                if (key === "Enter") {
                  onChange([
                    ...subTasks,
                    {
                      id: generateSubtaskId(),
                      text: target.value,
                      completed: false,
                    },
                  ]);
                  setAdding({ adding: true, key: key + 1, text: "" });
                  target.value = "";
                }
              }}
            />
          </Box>
        )}
      </Box>
    </DragDropContext>
  );
}

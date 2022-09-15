import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSmallScreen } from "../../../lib/utils";
import Column from "./column";
import { Box } from "@mui/material";

export default function Board({ cardState, setCardState, startAddCard, openUndoBar }) {
  const smallScreen = useSmallScreen();

  const onColChange = (data, idx) => {
    const deepCopy = JSON.parse(JSON.stringify(cardState));
    if (!data) {
      deepCopy.splice(idx, 1);
      openUndoBar("Category deleted");
    } else {
      deepCopy[idx] = data;
    }

    setCardState(deepCopy);
  };

  /**
   *
   * @param {import('./types').cardState} data
   * @param {number} colIdx
   * @param {number} cardIdx
   */
  const onCardChange = (data, colIdx, cardIdx) => {
    const deepCopy = JSON.parse(JSON.stringify(cardState));
    if (!data) {
      deepCopy[colIdx].items.splice(cardIdx, 1);
      openUndoBar("Card Deleted");
    } else {
      deepCopy[colIdx].items[cardIdx] = data;
    }

    setCardState(deepCopy);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * @param {import('react-beautiful-dnd').DropResult} result
   */
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (result.combine) {
      // must be column
      const deepCopy = JSON.parse(JSON.stringify(cardState));
      deepCopy
        .find((col) => col.id.toString() === result.combine.draggableId)
        .items.push(...deepCopy[source.index].items);
      deepCopy.splice(source.index, 1);
      setCardState(deepCopy);
      openUndoBar("Categories combined");
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    // didn't move
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === "COLUMN") {
      // category reorganizing
      const newState = reorder(cardState, source.index, destination.index);
      setCardState(newState);
    } else {
      // quote reshufling
      if (source.droppableId === destination.droppableId) {
        // stayed in same category

        // category index
        const idx = cardState.findIndex(
          (item) => item.id.toString() === source.droppableId
        );

        const deepCopy = JSON.parse(JSON.stringify(cardState));

        // reorder category
        deepCopy[idx].items = reorder(
          deepCopy[idx].items,
          source.index,
          destination.index
        );
        setCardState(deepCopy);
      } else {
        // moved categories
        const deepCopy = JSON.parse(JSON.stringify(cardState));

        const sourceIdx = cardState.findIndex(
          (item) => item.id.toString() === source.droppableId
        );

        const destIdx = cardState.findIndex(
          (item) => item.id.toString() === destination.droppableId
        );

        const [moving] = deepCopy[sourceIdx].items.splice(source.index, 1);
        deepCopy[destIdx].items.splice(destination.index, 0, moving);

        setCardState(deepCopy);
      }
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction={smallScreen ? "vertical" : "horizontal"}
        isCombineEnabled={true}
      >
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              display: "flex",
              alignItems: smallScreen ? "center" : "flex-start",
              padding: smallScreen ? "40px 0" : "40px",
              flexGrow: 1,
              overflow: "auto",
              flexDirection: smallScreen ? "column" : "row",
            }}
          >
            {cardState.map((column, index) => (
              <Column
                key={"col-" + column.id.toString()}
                data={column}
                index={index}
                onCardChange={(data, cardIdx) =>
                  onCardChange(data, index, cardIdx)
                }
                onAdd={startAddCard}
                onColChange={(data) => onColChange(data, index)}
              ></Column>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}

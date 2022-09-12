import { auth } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { Brightness4, Brightness7, Close } from "@mui/icons-material";
import { Box, Snackbar, IconButton, Button } from "@mui/material";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import moment from "moment";

import { useWindowSize } from "react-use";

import Menu from "../../components/Menu";
import NavBar from "../../components/NavBar";
import Column from "./DragDrop/column";
import AddCardModal from "./addCard";

import useUndoableState from "./undoableState";

import "./dashboard.css";
import setDocumentTitle from "../../lib/title";

export default function Dashboard() {
  setDocumentTitle('Dashboard');

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [user, loading]);

  const [menuOpen, setMenuOpen] = useState(false);

  const {
    state: cardState,
    setState: setCardState,
    resetState: resetCardState,
    index: cardStateIndex,
    lastIndex: cardStateLastIndex,
    goBack: undoCardState,
    goForward: redoCardState,
  } = useUndoableState([
    {
      id: 1 + 1000000,
      title: "first",
      color: "#FF6900",
      items: [
        {
          id: 1,
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
          id: 2,
          text: "world",
        },
      ],
    },
    {
      id: 2 + 10000000,
      title: "second",
      color: "#00d084",
      items: [
        {
          id: 3,
          text: "hi\nhttps://google.com",
        },
        {
          id: 4,
          text: "mom",
        },
      ],
    },
  ]);

	const nextAvailibleColId = () => Math.max(...cardState.map(col => col.id)) + 1;
	const nextAvailibleCardId = () => Math.max(...cardState.map(col => Math.max(...col.items.map(card => card.id)))) + 1;

  const [undoBarOpen, setUndoBarOpen] = useState(false);
  const [undoBarMessage, setUndoBarMessage] = useState("");

  const openUndoBar = (message) => {
    setUndoBarMessage(message);
    setUndoBarOpen(true);
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

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === "COLUMN") {
      const newState = reorder(cardState, source.index, destination.index);
      setCardState(newState);
    } else {
      // quote reshufling
      if (source.droppableId === destination.droppableId) {
        const idx = cardState.findIndex(
          (item) => item.id.toString() === source.droppableId
        );
        const deepCopy = JSON.parse(JSON.stringify(cardState));
        deepCopy[idx].items = reorder(
          deepCopy[idx].items,
          source.index,
          destination.index
        );
        setCardState(deepCopy);
      } else {
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

  const { width, height } = useWindowSize();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState("");
  const onAddModalClose = () => {
    setAddModalOpen(false);
  };

	const onAddModalSubmit = (data) => {
		const deepCopy = JSON.parse(JSON.stringify(cardState));
		const categoryIndex = deepCopy.findIndex((item) => item.title === data.category);
		deepCopy[categoryIndex].items.push({
			id: nextAvailibleCardId(),
			text: data.text,
			time: data.time.format('MMMM Do YYYY, h:mm:ss a'),
		});

		setCardState(deepCopy);
	};


  const startAddCard = async (colTitle) => {
    setAddModalOpen(true);
    setAddModalCategory(colTitle);
  };

  useEffect(() => {
    /**
     * @param {KeyboardEvent} event
     */
    const keydownListener = ({ key, ctrlKey, shiftKey, altKey }) => {
      if (ctrlKey && !shiftKey && !altKey) {
        if (key === "z") {
          undoCardState();
        } else if (key === "y") {
          redoCardState();
        }
      }
    };

    window.addEventListener("keydown", keydownListener, false);

    return () => {
      window.removeEventListener("keydown", keydownListener);
    };
  }, [cardStateIndex]);
  return (
    <>
      <Menu open={menuOpen} setOpen={setMenuOpen}></Menu>

      <Box
        sx={{ maxHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <NavBar
          // disable for now
          openMenu={null}
          onUndo={undoCardState}
          onRedo={redoCardState}
        ></NavBar>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="board"
            type="COLUMN"
            direction={width < 600 ? "vertical" : "horizontal"}
            isCombineEnabled={true}
          >
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: 5,
                  flexGrow: 1,
                  overflow: "auto",
                  flexDirection: width < 600 ? "column" : "row",
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
      </Box>
      <AddCardModal
        onClose={() => onAddModalClose(false)}
				onSubmit={onAddModalSubmit}
        defaults={{ time: moment(), text: "", category: addModalCategory }}
        open={addModalOpen}
        categories={cardState.map((item) => item.title)}
        defaultCategory={addModalCategory}
      />
      <Snackbar
        open={undoBarOpen}
        autoHideDuration={6000}
        onClose={() => setUndoBarOpen(false)}
        message={undoBarMessage}
        action={
          <>
            <Button
              color="secondary"
              size="small"
              onClick={() => {
                setUndoBarOpen(false);
                undoCardState();
              }}
            >
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setUndoBarOpen(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
}

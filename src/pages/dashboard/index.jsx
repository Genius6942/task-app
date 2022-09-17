// firebase
import {
  auth,
  requestPermission,
  startFirebaseMessaging,
} from "../../lib/firebase";
import { getUserBoard, updateUserBoard } from "../../lib/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

// react
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// material icons
import CloseIcon from "@mui/icons-material/Close";
// material ui
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// moment for time stuff
import moment from "moment";

// custom
import Menu from "../../components/Menu";
import NavBar from "../../components/NavBar";
import AddCardModal from "./addCard";
import useUndoableState from "./undoableState";
import { hideSplash, setDocumentTitle, useSmallScreen } from "../../lib/utils";
import AddColModal from "./addCol";
import Board from "./DragDrop/board";

// css
import "./dashboard.css";

export default function Dashboard() {
  setDocumentTitle("Dashboard");

  const [user, loading, error] = useAuthState(auth);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    if (dataLoaded) hideSplash();
  }, [dataLoaded]);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    (async () => {
      const loadedState = await getUserBoard(user.uid);
      setCardState(loadedState);
      setDataLoaded(true);
    })();

    requestPermission();
    startFirebaseMessaging();
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
    // {
    //   id: 1 + 10 ** 6,
    //   title: "first",
    //   color: "#FF6900",
    //   items: [
    //     {
    //       id: 1,
    //       text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //     },
    //     {
    //       id: 2,
    //       text: "world",
    //     },
    //   ],
    // },
    // {
    //   id: 2 + 10 ** 6,
    //   title: "second",
    //   color: "#00d084",
    //   items: [
    //     {
    //       id: 3,
    //       text: "hi\nhttps://google.com",
    //     },
    //     {
    //       id: 4,
    //       text: "mom",
    //     },
    //   ],
    // },
  ]);

  useEffect(() => {
    if (user) {
      updateUserBoard(user.uid, cardState);
    }
  }, [cardState]);

  // Create ids
  // when you call Math.max() with no items, it returns -Infinity, which when stringified turns into null
  // if an id is null, it will break the site, and will have to be manually fixed.
  // so make sure not null
  const nextAvailibleColId = () =>
    Math.max(...cardState.map((col) => col.id), 10 ** 6) + 1;
  const nextAvailibleCardId = () =>
    Math.max(
      ...cardState.map((col) => Math.max(...col.items.map((card) => card.id))),
      0
    ) + 1;

  // undo bar state
  const [undoBarOpen, setUndoBarOpen] = useState(false);
  const [undoBarMessage, setUndoBarMessage] = useState("");

  // opens the bar with message
  const openUndoBar = (message) => {
    setUndoBarMessage(message);
    setUndoBarOpen(true);
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState("");
  const onAddModalClose = () => {
    setAddModalOpen(false);
  };

  const onAddModalSubmit = (data) => {
    const deepCopy = JSON.parse(JSON.stringify(cardState));
    const categoryIndex = deepCopy.findIndex(
      (item) => item.title === data.category
    );
    deepCopy[categoryIndex].items.push({
      id: nextAvailibleCardId(),
      text: data.text,
      time: data.time.format("MMMM Do YYYY, h:mm:ss a"),
      title: data.title,
    });

    setCardState(deepCopy);
  };

  const startAddCard = (colTitle) => {
    setAddModalCategory(colTitle);
    setAddModalOpen(true);
  };

  const [addColModalOpen, setAddColModalOpen] = useState(false);

  const onAddColModalClose = () => {
    setAddColModalOpen(false);
  };

  const onAddColModalSubmit = ({ title }) => {
    const deepCopy = JSON.parse(JSON.stringify(cardState));
    deepCopy.push({
      id: nextAvailibleColId(),
      title,
      color: "#FF6900",
      items: [],
    });

    setCardState(deepCopy);
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

  const smallScreen = useSmallScreen();
  return (
    <>
      <Menu open={menuOpen} setOpen={setMenuOpen}></Menu>

      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar
          // disable for now
          openMenu={null}
          onUndo={undoCardState}
          onRedo={redoCardState}
          onAddCol={() => setAddColModalOpen(true)}
        ></NavBar>
        {cardState.length >= 1 ? (
          <Board
            cardState={cardState}
            setCardState={setCardState}
            startAddCard={startAddCard}
            openUndoBar={openUndoBar}
          />
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>Click the + in the Navbar to add a category</Typography>
          </Box>
        )}
      </Box>
      <AddCardModal
        onClose={() => onAddModalClose()}
        onSubmit={onAddModalSubmit}
        defaults={{
          time: moment(),
          title: "",
          text: "",
          category: addModalCategory,
        }}
        open={addModalOpen}
        categories={cardState.map((item) => item.title)}
      />
      <AddColModal
        onClose={() => onAddColModalClose()}
        onSubmit={onAddColModalSubmit}
        defaults={{
          title: "",
        }}
        open={addColModalOpen}
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
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
}

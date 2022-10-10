import { Button, IconButton, Snackbar } from "@mui/material";

import { Close } from "@mui/icons-material";

import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";

import { useTheme } from "@emotion/react";

const SnackbarContext = createContext({
  /**
   * @param {string} message
   */
  openErrorSnackbar: (message) => {},
  /**
   * @param {string} message
   * @param {() => void} onUndo
   */
  openUndoSnackbar: (message, onUndo) => {},
});

const SnackbarProvider = ({ ...props }) => {
  const [snackbarData, setSnackbarData] = useState({
    error: {
      message: "",
      open: false,
    },
    undo: {
      message: "",
      onUndo: () => {},
      open: false,
    },
  });

  const openErrorSnackbar = (message) => {
    setSnackbarData({
      ...snackbarData,
      error: {
        message,
        open: true,
      },
    });
  };

  const openUndoSnackbar = (message, onUndo) => {
    setSnackbarData({
      ...snackbarData,
      undo: {
        message,
        onUndo,
        open: true,
      },
    });
  };

  const theme = useTheme();

  return (
    <SnackbarContext.Provider value={{ openErrorSnackbar, openUndoSnackbar }}>
      {props.children}
      {/* Error */}
      <Snackbar
        open={snackbarData.error.open}
        autoHideDuration={6000}
        onClose={() =>
          setSnackbarData({
            ...snackbarData,
            error: { message: "", open: false },
          })
        }
        message={snackbarData.error.message}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color={theme.palette.mode === "dark" ? "black" : "white"}
              onClick={() =>
                setSnackbarData({
                  ...snackbarData,
                  error: { message: "", open: false },
                })
              }
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
      />
      {/* Undo */}
      <Snackbar
        open={snackbarData.undo.open}
        autoHideDuration={6000}
        onClose={() =>
          setSnackbarData({
            ...snackbarData,
            undo: { message: "", onUndo: () => {}, open: false },
          })
        }
        message={snackbarData.undo.message}
        action={
          <>
            <Button
              size="small"
              onClick={() => {
                snackbarData.undo.onUndo();
                setSnackbarData({
                  ...snackbarData,
                  undo: { message: "", onUndo: () => {}, open: false },
                });
              }}
            >
              UNDO
            </Button>
            <IconButton
              color={theme.palette.mode === "dark" ? "black" : "white"}
              onClick={() =>
                setSnackbarData({
                  ...snackbarData,
                  undo: { message: "", onUndo: () => {}, open: false },
                })
              }
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
      />
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => useContext(SnackbarContext);

export { useSnackbar, SnackbarProvider };

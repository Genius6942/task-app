import { useTheme } from "@mui/material/styles";

import { Alert, Button, Snackbar } from "@mui/material";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react";

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

const CustomAlert = forwardRef((props, ref) => (
  <Alert elevation={6} ref={ref} variant="filled" {...props} />
));

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
  useEffect(() => {
    /**
     * @param {KeyboardEvent} event
     */
    const listener = ({ key, ctrlKey }) => {
      if (ctrlKey && key.toLowerCase() === "z") {
        snackbarData.undo.onUndo();
      }
    };

    window.addEventListener("keydown", listener, true);

    return () => window.removeEventListener("keydown", listener);
  }, [snackbarData]);

  return (
    <SnackbarContext.Provider value={{ openErrorSnackbar, openUndoSnackbar }}>
      {props.children}
      {/* Error */}
      <Snackbar
        color="error"
        open={snackbarData.error.open}
        autoHideDuration={6000}
        onClose={() =>
          setSnackbarData({
            ...snackbarData,
            error: { message: "", open: false },
          })
        }
      >
        <CustomAlert
          onClose={() =>
            setSnackbarData({
              ...snackbarData,
              error: { message: "", open: false },
            })
          }
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarData.error.message}
        </CustomAlert>
      </Snackbar>
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
      >
        <CustomAlert
          onClose={() =>
            setSnackbarData({
              ...snackbarData,
              undo: { message: "", onUndo: () => {}, open: false },
            })
          }
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackbarData.undo.message}
          <Button
            size="small"
            onClick={() => {
              snackbarData.undo.onUndo();
              setSnackbarData({
                ...snackbarData,
                undo: { message: "", onUndo: () => {}, open: false },
              });
            }}
            color="secondary"
          >
            UNDO
          </Button>
        </CustomAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => useContext(SnackbarContext);

export { useSnackbar, SnackbarProvider };

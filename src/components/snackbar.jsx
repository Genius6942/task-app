import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";


const SnackbarContext = createContext({
  error: "",
  undo: {
    message: "",
    onUndo: () => {},
  }
});

const ConfettiProvider = ({ ...props }) => {
  const [snackbarData, setSnackbarData] = useState({
    error: "",
    undo: {
      message: "",
      onUndo: () => {},
    },
  });

  return <>
    
  </>
};

const useConfetti = () => useContext(ConfettiContext);

export { useConfetti, ConfettiProvider };
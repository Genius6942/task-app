import { useTheme } from "@mui/material/styles";

import { Box, Button, Typography } from "@mui/material";

import { useState } from "react";
import { Link } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import TypeWriter from "typewriter-effect";

import { app_name } from "../lib/constants";
import { generateId } from "../lib/firebase/firestore";
import { hideSplash, setDocumentTitle } from "../lib/utils";
import { useSmallScreen } from "../lib/utils";

const words = ["homework", "studying"];

export default function Home() {
  const theme = useTheme();
  setDocumentTitle(null);
  hideSplash();
  const [wordState, setWordState] = useState({
    key: 0,
    word: "work",
  });
  const style = `
    background: linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: "inline-block";
    font-size: 50px;
    font-weight: bold;
  `;
  const smallScreen = useSmallScreen();
  return (
    <>
      <Box
        sx={{
          overflow: "hidden",
          background: "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)",
          padding: 10,
          pb: smallScreen ? 20 : 10,
        }}
      >
        <Typography fontWeight="bold" fontSize={50}>
          <Typography fontWeight="inherit" fontSize="inherit" sx={{textDecoration: "underline"}}>{app_name}:</Typography> the app to help you manage
        </Typography>
        <Box sx={{ overflow: "hidden", width: 300 }}>
          <TypeWriter
            options={{
              loop: true,
              autoStart: true,
              strings: words.map(
                (word) => `<span style='${style}'>${word}</span>`
              ),
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          m: 3,
          justifyContent: smallScreen ? "center" : null,
        }}
      >
        <Link to="/register">
          <Button variant="contained">Sign up</Button>
        </Link>
        <Link to="/login">
          <Button variant="outlined">Log in</Button>
        </Link>
      </Box>
    </>
  );
}

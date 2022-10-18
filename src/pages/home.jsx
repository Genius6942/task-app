import { useTheme } from "@mui/material/styles";

import { Box, Button, Typography } from "@mui/material";

import { Link } from "react-router-dom";

import TypeWriter from "typewriter-effect";

import { app_name } from "../lib/constants";
import { hideSplash, setDocumentTitle, useSmallScreen } from "../lib/utils";

const words = ["homework", "studying"];

export default function Home() {
  const theme = useTheme();
  setDocumentTitle(null);
  hideSplash();
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
        <Typography
          fontWeight="bold"
          fontSize={50}
          sx={{ textDecoration: "underline" }}
        >
          {app_name}:
        </Typography>
        <Typography fontWeight="bold" fontSize={50}>
          the app to help you manage
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
      <Box
        sx={{
          mx: !smallScreen && 3,
          textAlign: smallScreen && "center",
          paddingBottom: !smallScreen && 30,
        }}
      >
        <Typography fontSize={40}>Anytime, anywhere.</Typography>
        <Typography>
          {app_name} is designed to work on all of your devices.
        </Typography>
      </Box>
      <Box
        sx={
          !smallScreen
            ? {
                display: "flex",
                alignItems: "flex-end",
                position: "absolute",
                top: 170,
                right: 10,
              }
            : {
                display: "flex",
                flexDirection: "column",
              }
        }
      >
        <img
          draggable="false"
          src="/screenshots/screenshot-computer.png"
          alt="computer-screenshot"
          style={
            (!smallScreen && {
              marginRight: -150,
            }) ||
            {}
          }
          width={1000}
          height={562.5}
        />
        <img
          draggable="false"
          src="/screenshots/screenshot-mobile.png"
          alt="mobile screenshot"
          width={375}
          height={600}
        />
      </Box>
      <Box sx={{ background: "#000851", color: "common.white", p: 2 }}>
        <Typography color="white">
          Copyright © doit {new Date().getFullYear()}
        </Typography>
      </Box>
    </>
  );
}

import { ThemeProvider } from "@mui/material/styles";

import {
  Box,
  Button,
  Card,
  CardActions,
  CssBaseline,
  IconButton,
  Typography,
} from "@mui/material";

// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
import { Close } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useEffectOnce } from "react-use";

import "fuckadblock";

import { AdBlockModal, detectAdblock } from "./lib/adblock";
import { app_name } from "./lib/constants";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Login from "./pages/login";
import NewDashboard from "./pages/new_dashboard";
import Account from "./pages/new_dashboard/pages/account";
import DashboardHome from "./pages/new_dashboard/pages/home.jsx";
import Schedule from "./pages/new_dashboard/pages/schedule";
import Register from "./pages/register";
import createTheme from "./theme";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({ dark: darkMode });

  const [defferedEvent, setDefferedEvent] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      e.preventDefault();

      setDefferedEvent(e);
    };

    window.addEventListener("beforeinstallprompt", listener, true);

    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  // detect ad blocker
  const [adBlockModalOpen, setAdBlockModalOpen] = useState(false);
  useEffectOnce(() => {
    /* global fuckAdBlock */
    if (localStorage.getItem("force-hide-adblock-msg") === "1") return;
    fuckAdBlock.onDetected(() => {
      console.log("ad block in use");
      setAdBlockModalOpen(true);
    });
    fuckAdBlock.onNotDetected(async () => {
      const blocks = (await detectAdblock()).filter((item) => item);
      if (blocks.length > 0) {
        console.log("ad block in use");
        setAdBlockModalOpen(true);
      } else {
        console.log("no ad block");
      }
    });
    fuckAdBlock.check();
  });

  const onInstall = async () => {
    if (!defferedEvent) {
      console.error("no deffered event");
      return;
    }
    // defferedEvent is a global variable we've been using in the sample to capture the `beforeinstallevent`
    defferedEvent.prompt();
    // Find out whether the user confirmed the installation or notn
    const { outcome } = await defferedEvent.userChoice;
    // The defferedEvent can only be used once.
    setDefferedEvent(null);
    // Act on the user's choice
    if (outcome === "accepted") {
      console.log("User accepted the install prompt.");
    } else if (outcome === "dismissed") {
      console.log("User dismissed the install prompt");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="/old_dashboard" element={<Dashboard />} />
            <Route
              path="dashboard"
              element={
                <NewDashboard
                  changeTheme={({ dark = false }) => setDarkMode(dark)}
                />
              }
            >
              <Route path="" element={<DashboardHome />} />
              <Route path="subjects" element={<>subjects</>} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="history" element={<>history</>} />
              <Route path="account" element={<Account />} />
            </Route>

            {/* 404 page */}
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </Router>
        {defferedEvent && (
          <Card
            sx={{
              position: "fixed",
              top: 20,
              right: 20,
              padding: 2,
              gap: 2,
              maxWidth: 200,
              zIndex: 100,
            }}
          >
            <CardActions>
              <Box sx={{ display: "flex", flexGrow: 1 }}>
                <Typography fontSize={20} sx={{ marginRight: 1 }}>
                  Intsall {app_name}
                </Typography>
                <img src="/favicon-32x32.png" alt="logo" />
              </Box>
              <IconButton onClick={() => setDefferedEvent(null)}>
                <Close />
              </IconButton>
            </CardActions>
            <Box>
              <Typography marginBottom={1}>
                Install this site as an app for a better experience.
              </Typography>
              <Button variant="contained" onClick={onInstall}>
                Install
              </Button>
            </Box>
          </Card>
        )}
        <AdBlockModal
          open={adBlockModalOpen}
          onForceClose={() => {
            localStorage.setItem("force-hide-adblock-msg", "1");
            setAdBlockModalOpen(false);
          }}
        />
      </ThemeProvider>
    </>
  );
}

export default App;

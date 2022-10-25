import { ThemeProvider } from "@mui/material/styles";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CssBaseline,
  IconButton,
  Link,
  Typography
} from "@mui/material";

import { Close } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffectOnce } from "react-use";

import "fuckadblock";

import { ConfettiProvider } from "./components/confetti";
import { SnackbarProvider } from "./components/snackbar";
import { SubjectContextProvider } from "./components/subjectContext";
import { AdBlockModal, detectAdblock } from "./lib/adblock";
import { app_name, feedback_url } from "./lib/constants";
import { auth } from "./lib/firebase";
import { getUser, updateUser } from "./lib/firebase/firestore/user";
import { useSmallScreen } from "./lib/utils";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Login from "./pages/login";
import NewDashboard from "./pages/new_dashboard";
import { TaskContextProvider } from "./pages/new_dashboard/components/task/context";
import Account from "./pages/new_dashboard/pages/account";
import History from "./pages/new_dashboard/pages/history";
import DashboardHome from "./pages/new_dashboard/pages/home.jsx";
import Schedule from "./pages/new_dashboard/pages/schedule";
import Subjects from "./pages/new_dashboard/pages/subjects";
import NotVerified from "./pages/notverifed";
import Register from "./pages/register";
import createTheme from "./theme";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({ dark: darkMode });
  const smallScreen = useSmallScreen();

  const [defferedEvent, setDefferedEvent] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      e.preventDefault();

      setDefferedEvent(e);
    };

    window.addEventListener("beforeinstallprompt", listener, true);

    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (!user || loading) return;
    localStorage.setItem("uid", user.uid);
    (async () => {
      const userData = await getUser(user.uid);
      const dark = userData.darkMode;
      // user.darkMode === "undefined"
      //   ? window.matchMedia("(prefers-color-scheme: dark)").matches
      //   : userData.darkMode;
      setDarkMode(!!dark);
    })();
  }, [user, loading]);

  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      const userData = await getUser(user.uid);
      const newData = {
        ...userData,
        darkMode,
      };

      await updateUser(user.uid, newData);
    })();
  }, [darkMode]);

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
        <ConfettiProvider>
          <TaskContextProvider user={user}>
            <SubjectContextProvider user={user}>
              <SnackbarProvider>
                <CssBaseline />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    maxHeight: "100%",
                    overflowX: "hidden",
                  }}
                >
                  <Alert severity="info" sx={{ pl: !smallScreen && 10 }}>
                    This app is in beta. Please contribute by submiting a bug or
                    feedback{" "}
                    <Link href={feedback_url} target="_blank">
                      here.
                    </Link>
                  </Alert>
                  <Box
                    sx={{
                      flexGrow: 1,
                      position: "relative",
                      overflow: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <Router>
                      <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route path="/old_dashboard" element={<Dashboard />} />
                        <Route path="/notverified" element={<NotVerified />} />
                        <Route
                          path="dashboard"
                          element={
                            <NewDashboard
                              changeTheme={({ dark = false }) => {
                                setDarkMode(dark);
                              }}
                            />
                          }
                        >
                          <Route path="" element={<DashboardHome />} />
                          <Route path="subjects" element={<Subjects />} />
                          <Route path="schedule" element={<Schedule />} />
                          <Route path="history" element={<History />} />
                          <Route
                            path="account"
                            element={
                              <Account
                                changeTheme={({ dark = false }) => {
                                  setDarkMode(dark);
                                }}
                              />
                            }
                          />
                        </Route>

                        {/* 404 page */}
                        <Route path="*" element={<div>404</div>} />
                      </Routes>
                    </Router>
                  </Box>
                </Box>
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
                        <Typography
                          fontSize={20}
                          sx={{ marginRight: 1 }}
                          whiteSpace="nowrap"
                        >
                          Install {app_name}
                        </Typography>
                        <img
                          src="/icons/favicon-32x32.png"
                          alt="logo"
                          style={{ width: 32, height: 32 }}
                        />
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
                  // open={adBlockModalOpen}
                  open={false}
                  onForceClose={() => {
                    localStorage.setItem("force-hide-adblock-msg", "1");
                    setAdBlockModalOpen(false);
                  }}
                />
              </SnackbarProvider>
            </SubjectContextProvider>
          </TaskContextProvider>
        </ConfettiProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

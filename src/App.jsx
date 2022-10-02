import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import { useEffectOnce } from "react-use";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import Close from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { ThemeProvider } from "@mui/material/styles";
import { app_name } from "./lib/constants";
import NewDashboard from "./pages/new_dashboard";
import DashboardHome from "./pages/new_dashboard/pages/home.jsx";

import createTheme from "./theme";
import Account from "./pages/new_dashboard/pages/account";
import Schedule from "./pages/new_dashboard/pages/schedule";

function App() {
  const [cards, setCards] = useState([
    {
      id: 0,
      value: 1,
    },
  ]);

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

  const onInstall = async () => {
    if (!defferedEvent) {
      console.error("no deffered event");
      return;
    }
    // defferedEvent is a global variable we've been using in the sample to capture the `beforeinstallevent`
    defferedEvent.prompt();
    // Find out whether the user confirmed the installation or not
    const { outcome } = await defferedEvent.userChoice;
    // The defferedEvent can only be used once.
    setDefferedEvent(null);
    // Act on the user's choice
    if (outcome === "accepted") {
      console.log("User accepted the install prompt.");
    } else if (outcome === "dismissed") {
      console.log("User dismissed the install prompt");
    }

    const location = useLocation();
  };

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;

import { useTheme } from "@mui/material/styles";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  styled,
} from "@mui/material";

import {
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  DarkMode,
  Home,
  LightMode,
  List as ListIcon,
  PersonOutline,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import PageAnimateLayout from "../../Animate";
import { auth } from "../../lib/firebase";
import { requestPermission, startFirebaseMessaging } from "../../lib/firebase";
import { getTasks } from "../../lib/firebase/firestore/task";
import { hideSplash, useSmallScreen } from "../../lib/utils";
import AddButton from "./components/add";
import { TaskContextProvider } from "./components/task/context";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const WrapperDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function NewDashboard({ changeTheme }) {
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    requestPermission();
    startFirebaseMessaging(user.uid);
    hideSplash();
  }, [user, loading]);

  const smallScreen = useSmallScreen();

  const location = useLocation();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    const index = location.pathname.indexOf(
      "/",
      location.pathname.indexOf("/") + 1
    );
    return index === -1 ? "" : location.pathname.substring(index + 1);
  };

  const [navState, setNavState] = useState(
    getDashboardPath() === "" ? "home" : getDashboardPath()
  );

  const handleNavChange = (event, newValue) => {
    setNavState(newValue);
    navigate(newValue === "home" ? "" : newValue);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [temporaryDrawerOpen, setTemporaryDrawerOpen] = useState(false);

  const theme = useTheme();

  const navItems = [
    {
      name: "Home",
      icon: Home,
    },
    {
      name: "Schedule",
      icon: CalendarMonth,
    },
    {
      name: "Subjects",
      icon: ListIcon,
    },
    {
      name: "Account",
      icon: PersonOutline,
    },
  ];

  return (
    <TaskContextProvider user={user}>
      {smallScreen ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              position: "relative",
            }}
          >
            <Outlet />
            <AddButton />
          </Box>

          <BottomNavigation
            value={navState}
            onChange={handleNavChange}
            // showLabels
          >
            {navItems.map((item, idx) => (
              <BottomNavigationAction
                key={idx}
                label={item.name}
                value={item.name.toLowerCase()}
                icon={<item.icon />}
              />
            ))}
          </BottomNavigation>
        </Box>
      ) : (
        <Box sx={{ display: "flex", height: "100vh" }}>
          <WrapperDrawer
            variant="permanent"
            open={drawerOpen || temporaryDrawerOpen}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                {drawerOpen || temporaryDrawerOpen ? (
                  <ChevronLeft />
                ) : (
                  <ChevronRight />
                )}
              </IconButton>
            </Box>
            <Divider />
            <List
              sx={{ flexGrow: 1 }}
              onMouseEnter={() => setTemporaryDrawerOpen(true)}
              onMouseLeave={() => setTemporaryDrawerOpen(false)}
            >
              {navItems.map((item, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton
                    sx={{
                      justifyContent:
                        drawerOpen || temporaryDrawerOpen
                          ? "initial"
                          : "center",
                    }}
                    color={
                      navState === item.name.toLowerCase() ? "primary" : ""
                    }
                    onClick={(e) => {
                      handleNavChange(e, item.name.toLowerCase());
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen || temporaryDrawerOpen ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <item.icon
                        sx={{
                          transform: temporaryDrawerOpen
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                          transition: "transform 0.3s ease-in-out",
                        }}
                        color={
                          navState === item.name.toLowerCase() ? "primary" : ""
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      sx={{
                        opacity: drawerOpen || temporaryDrawerOpen ? 1 : 0,
                        transition:
                          (drawerOpen || temporaryDrawerOpen) &&
                          theme.transitions.create("opacity", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                          }),
                      }}
                      primaryTypographyProps={{
                        color:
                          navState === item.name.toLowerCase() ? "primary" : "",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
              {false && (
                <ListItem
                  sx={{
                    justifyContent:
                      drawerOpen || temporaryDrawerOpen ? "initial" : "center",
                    alignItems: "center",
                    height: "48px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen || temporaryDrawerOpen ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {theme.palette.mode === "dark" ? (
                      <DarkMode />
                    ) : (
                      <LightMode />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Dark Mode"
                    sx={{
                      opacity: drawerOpen || temporaryDrawerOpen ? 1 : 0,
                      transition: "opacity ease",
                      transitionDuration: theme.transitions.duration.shortest,
                    }}
                  />
                  {
                    <Switch
                      edge="end"
                      onChange={({ target }) =>
                        changeTheme({ dark: target.checked })
                      }
                      checked={theme.palette.mode === "dark"}
                      sx={{
                        display:
                          drawerOpen || temporaryDrawerOpen ? null : "none",
                      }}
                    />
                  }
                </ListItem>
              )}
            </List>
          </WrapperDrawer>
          <PageAnimateLayout>
            <Outlet />
          </PageAnimateLayout>
          <AddButton />
        </Box>
      )}
    </TaskContextProvider>
  );
}

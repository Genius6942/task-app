import { styled, useTheme } from "@mui/material/styles";

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
  Tooltip,
} from "@mui/material";

import {
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  CloudDone,
  CloudOff,
  DarkMode,
  History,
  Home,
  LightMode,
  List as ListIcon,
  PersonOutline,
  Refresh,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";

import moment from "moment";

import PageAnimateLayout from "../../Animate";
import { useSubjects } from "../../components/subjectContext";
import {
  auth,
  requestPermission,
  startFirebaseMessaging,
} from "../../lib/firebase";
import { removeTask } from "../../lib/firebase/firestore/task";
import { createUser, getUser } from "../../lib/firebase/firestore/user";
import { hideSplash, setDocumentTitle, useSmallScreen } from "../../lib/utils";
import AddButton from "./components/add";
import { useTasks } from "./components/task/context";

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
  position: "relative",
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

  const { subjects, fetchSubjectUpdate } = useSubjects();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    if (!user.emailVerified) return navigate("/notverified");
    console.log("email verified");
    (async () => {
      try {
        await getUser(user.uid);
        requestPermission();
        startFirebaseMessaging(user.uid);
        hideSplash();

        fetchSubjectUpdate();
        fetchTaskUpdate();
      } catch (e) {
        console.error(e);
        console.log("create user");
        await createUser(user);
        console.log("user created");
      }
    })();
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
  useEffect(() => {
    setDocumentTitle(
      "dashboard | " + navState.charAt(0).toUpperCase() + navState.slice(1)
    );
  }, [navState]);

  const handleNavChange = (event, newValue) => {
    setNavState(newValue);
    navigate(newValue === "home" ? "" : newValue);
  };
  useEffect(() => {
    const displayedPath = location.pathname.slice(11);
    const currentUrl = displayedPath === "" ? "home" : displayedPath;
    if (currentUrl !== navState) {
      setNavState(currentUrl);
    }
  }, [location]);

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
      name: "History",
      icon: History,
    },
    {
      name: "Account",
      icon: PersonOutline,
    },
  ];

  const { tasks, fetchTaskUpdate } = useTasks();
  useEffect(() => {
    (async () => {
      const tasksToRemove = tasks.filter(
        (task) =>
          task.completes.length ===
            task.completes.filter((item) => item).length &&
          moment().startOf("day").diff(task.dueDate, "day") >= 30
      );
      if (tasksToRemove.length > 0) {
        await Promise.all(
          tasksToRemove.map(async (task) => {
            await removeTask(task.id);
            return true;
          })
        );
        await fetchTaskUpdate();
      }
    })();
  }, [tasks]);
  const [reloadRotate, setReloadRotate] = useState(0);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffectOnce(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
  });

  return (
    <>
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 20,
          display: "flex",
        }}
      >
        <Tooltip
          title={
            isOnline
              ? "Saving to the cloud"
              : "Working offline - some features may not work"
          }
        >
          <IconButton
            onClick={() => {
              // some offline easter egg?
            }}
          >
            {isOnline ? <CloudDone /> : <CloudOff />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh tasks">
          <IconButton
            onClick={async () => {
              setReloadRotate(reloadRotate + 360);
              await fetchTaskUpdate();
              await fetchSubjectUpdate();
            }}
          >
            <Refresh
              sx={{
                transform: `rotate(${reloadRotate}deg)`,
                transition: "transform 1s cubic-bezier(0.66, -0.01, 0.3, 1)",
              }}
            />
          </IconButton>
        </Tooltip>
      </span>
      {smallScreen ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              position: "relative",
            }}
          >
            <Outlet />
            {navState !== "account" && <AddButton />}
          </Box>

          <BottomNavigation
            value={navState}
            onChange={handleNavChange}
            // showLabels
          >
            {subjects.length < 1 && (
              <Tooltip
                placement="top"
                open
                title="Create your first subject to get started"
                arrow
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 9999,
                    background: theme.palette.primary.main + "70",
                    position: "absolute",
                    bottom: 7,
                    right: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&::after": {
                      background: theme.palette.primary.main,
                      width: 0,
                      height: 0,
                    },
                  }}
                />
              </Tooltip>
            )}
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
        <Box sx={{ display: "flex", height: "100%", maxWidth: "100%" }}>
          <WrapperDrawer
            variant="permanent"
            open={drawerOpen || temporaryDrawerOpen}
          >
            {subjects.length < 1 && (
              <Tooltip
                placement="right"
                open
                title="Create your first subject to get started"
                arrow
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 9999,
                    background: theme.palette.primary.main + "70",
                    position: "absolute",
                    top: 245,
                    left: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&::after": {
                      background: theme.palette.primary.main,
                      width: 0,
                      height: 0,
                    },
                  }}
                />
              </Tooltip>
            )}
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
                          // transform: temporaryDrawerOpen
                          //   ? "rotateY(180deg)"
                          //   : "rotateY(0deg)",
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
              {true && (
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
                    primary="Theme (beta)"
                    sx={{
                      opacity: drawerOpen || temporaryDrawerOpen ? 1 : 0,
                      transition: "opacity ease",
                      transitionDuration: theme.transitions.duration.shortest,
                    }}
                  />
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
                </ListItem>
              )}
            </List>
          </WrapperDrawer>
          <Box
            sx={{
              flexGrow: 1,
              position: "relative",
              overflow: "auto",
              display: "flex",
            }}
          >
            <PageAnimateLayout>
              <Outlet />
            </PageAnimateLayout>
          </Box>
          {navState !== "account" && <AddButton />}
        </Box>
      )}
    </>
  );
}

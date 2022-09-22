import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { hideSplash, useSmallScreen } from "../../lib/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { useState, useEffect } from "react";
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
  styled,
} from "@mui/material";
import {
  Home,
  CalendarMonth,
  List as ListIcon,
  PersonOutline,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { requestPermission, startFirebaseMessaging } from "../../lib/firebase";

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

export default function NewDashboard() {
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

  console.log(navState);

  return smallScreen ? (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <BottomNavigation value={navState} onChange={handleNavChange} showLabels>
        {navItems.map((item, idx) => (
          <BottomNavigationAction
            key={idx}
            label={item.name}
            value={item.name.toLowerCase()}
            icon={item.icon}
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
                    drawerOpen || temporaryDrawerOpen ? "initial" : "center",
                }}
                color={navState === item.name.toLowerCase() ? "primary" : ""}
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
                    color={
                      navState === item.name.toLowerCase() ? "primary" : ""
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{ opacity: drawerOpen || temporaryDrawerOpen ? 1 : 0 }}
                  primaryTypographyProps={{
                    color:
                      navState === item.name.toLowerCase() ? "primary" : "",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </WrapperDrawer>
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

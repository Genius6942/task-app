import { auth } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useNavigate, Link } from "react-router-dom";

import { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  Container,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";

import { Undo, Redo, Menu as MenuIcon } from "@mui/icons-material";

export default function NavBar({ openMenu, onUndo, onRedo }) {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [user, loading]);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="">
        <Toolbar disableGutters>
          {openMenu && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => openMenu()}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: { sm: "center", md: "flex-start" },
            }}
          >
            <Typography fontSize={20}>My Dashboard</Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Undo">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => onUndo()}
              >
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => onRedo()}
              >
                <Redo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user && (user.displayName || user.email)}
                  src={user && user.photoURL}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link to="/profile">
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Account</Typography>
                </MenuItem>
              </Link>
              <MenuItem onClick={() => auth.signOut()}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { Add, Menu as MenuIcon, Redo, Undo } from "@mui/icons-material";

import CloudDone from "@mui/icons-material/CloudDone";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { app_name } from "../../lib/constants";
import { auth } from "../../lib/firebase";

export default function NavBar({
  openMenu,
  onUndo,
  onRedo,
  onAddCol,
  savedState,
}) {
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
              alignItems: "center",
            }}
          >
            <NavLink to="/" style={{ display: "flex" }}>
              <img src="/favicon-32x32.png" alt="logo" />

              <Typography fontSize={20} whiteSpace="nowrap" sx={{ mx: 2 }}>
                {app_name}
              </Typography>
            </NavLink>
            <Tooltip title="Undo">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="Saved"
                sx={{ mr: 2 }}
              >
                <CloudDone />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Undo">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="undo"
                sx={{ mr: 2 }}
                onClick={() => onUndo()}
              >
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Category">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="add"
                sx={{ mr: 2 }}
                onClick={() => onAddCol()}
              >
                <Add />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="redo"
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

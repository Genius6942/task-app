// firebase
import Box from "@mui/material/Box";
// mui
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// react
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useSnackbar } from "../components/snackbar";
import { app_name } from "../lib/constants";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../lib/firebase";
// custom
import { hideSplash, setDocumentTitle } from "../lib/utils";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <RouterLink to="/">{app_name}</RouterLink> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  setDocumentTitle("Login");
  hideSplash();

  const { openErrorSnackbar } = useSnackbar();

  const throwError = (message) => {
    return openErrorSnackbar(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("password").length < 1) {
      return throwError("Password required.");
    } else if (data.get("email").length < 1) {
      return throwError("Email required");
    }
    try {
      await logInWithEmailAndPassword(data.get("email"), data.get("password"));
    } catch (e) {
      console.error(e);
      throwError(
        e.message
          .replaceAll("Firebase: ", "")
          .replaceAll("auth/", "")
          .replaceAll("(", "")
          .replaceAll(")", "")
          .replaceAll("Error", "Error:")
          .replaceAll("-", " ")
      );
    }
  };

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, textTransform: "none" }}
            color="white"
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2, textTransform: "none" }}
            onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (e) {
                console.error(e);
                throwError(
                  e.message
                    .replaceAll("Firebase: ", "")
                    .replaceAll("auth/", "")
                    .replaceAll("(", "")
                    .replaceAll(")", "")
                    .replaceAll("Error", "Error:")
                    .replaceAll("-", " ")
                );
              }
            }}
            color="white"
          >
            <img
              src="/google_logo.png"
              alt="google logo"
              width={31}
              height={30}
              style={{ marginRight: 10 }}
            />
            Login with Google
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Don&apos;t have an account? Register.
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

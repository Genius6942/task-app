// firebase
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// react
import { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// mui
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// custom
import googleImageUrl from "../assets/google_logo.png";
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
      <RouterLink to="/">
        <Link>doit</Link>
      </RouterLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
    white: createColor("#FFFFFF"),
  },
});

export default function Register() {
  setDocumentTitle('Register');
  hideSplash();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    registerWithEmailAndPassword(data.get('name'), data.get("email"), data.get("password"));
  };

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <ThemeProvider theme={theme}>
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
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Your Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
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
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={signInWithGoogle}
              color="white"
            >
              <img src={googleImageUrl} width={31} height={30} style={{marginRight: 10}}/>
              Register with Google
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <RouterLink to="/login">
                  <Link>Already have an account? Log in</Link>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

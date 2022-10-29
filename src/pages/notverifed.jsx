import { Box, Button, Card } from "@mui/material";

import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { sendEmailVerification } from "firebase/auth";

import { auth } from "../lib/firebase";
import { hideSplash } from "../lib/utils";

export default function NotVerified() {
  hideSplash();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    if (user.emailVerified) return navigate("/dashboard");
    console.log("user not verified", user.emailVerified);
  });
  if (user && user.emailVerified) navigate("/dashboard");
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        One more step! You need to verify your email.
        <br />
        The email may be in your spam.
        <br />
        <Button
          onClick={async () => {
            if (user) {
              await sendEmailVerification(user);
              alert(`Email sent to ${user.email}! (email may appear in spam)`);
            }
          }}
        >
          Resend Verification Email
        </Button>
        <Button
          onClick={async () => {
            history.go(0);
          }}
        >
          Refresh
        </Button>
      </Card>
    </Box>
  );
}

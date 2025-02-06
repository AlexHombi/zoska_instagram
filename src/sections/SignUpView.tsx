// src/sections/SignUpView.tsx

"use client";

import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import React, { useState } from "react";

export default function SignUpView() {
  const [gdprChecked, setGdprChecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Handle GDPR Checkbox Change
  const handleGdprChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGdprChecked(event.target.checked);
    if (event.target.checked) setShowAlert(false);
  };

  // Handle Sign-Up Attempt
  const handleSignUp = (provider: string) => {
    if (!gdprChecked) {
      setShowAlert(true);
      return;
    }
    signIn(provider, { callbackUrl: "/prispevok" });
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
        p: 3,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {/* Logo / Title */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Registrácia
      </Typography>

      {/* Sign-in link */}
      <Typography variant="body1" sx={{ mb: 6 }}>
        Už máte účet?{" "}
        <Typography
          component="a"
          href="/auth/prihlasenie"
          sx={{ textDecoration: "none", color: "primary.main" }}
        >
          Prihláste sa
        </Typography>
      </Typography>

      {/* Show Alert if GDPR is not checked */}
      {showAlert && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          Musíte súhlasiť s podmienkami GDPR, aby ste mohli pokračovať.
        </Alert>
      )}

      {/* Google Sign Up */}
      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={() => handleSignUp("google")}
        sx={{ mb: 1 }}
      >
        Registrovať sa účtom Google
      </Button>

      {/* GitHub Sign Up */}
      <Button
        variant="outlined"
        fullWidth
        startIcon={<GitHubIcon />}
        onClick={() => handleSignUp("github")}
        sx={{ mb: 3 }}
      >
        Registrovať sa účtom GitHub
      </Button>

      {/* GDPR Checkbox */}
      <FormControlLabel
        control={
          <Checkbox checked={gdprChecked} onChange={handleGdprChange} />
        }
        label={
          <Typography variant="body2">
            Súhlasím s{" "}
            <Typography
              component="a"
              href="/gdpr"
              sx={{ textDecoration: "none", color: "primary.main" }}
            >
              podmienkami GDPR
            </Typography>
          </Typography>
        }
        sx={{ alignSelf: "flex-start", mb: 2 }}
      />
    </Container>
  );
};
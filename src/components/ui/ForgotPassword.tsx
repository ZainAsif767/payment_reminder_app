import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "../utils/Copyright";
import React, { useState } from "react";
import {
  getSignInMethodsForEmail,
  sendPasswordReset,
} from "../../firebase/firebase";
import { toast } from "../utils/swal";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(!validateEmail(e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidEmail = validateEmail(email);
    setEmailError(!isValidEmail);

    if (isValidEmail) {
      try {
        const signInMethods = await getSignInMethodsForEmail(email);
        console.log(signInMethods);
        await sendPasswordReset(email);
        toast
          .fire({
            icon: "success",
            text: "Reset Password Link Sent!",
            timerProgressBar: true,
          })
          .then(() => navigate("/"));
      } catch (error) {
        console.error("Error during password reset:", error);
        toast.fire({
          icon: "error",
          text: "Something went wrong, try again",
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" sx={{ height: "70vh" }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "purple" }}>
            <LockOpenIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password?
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: "35%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={emailError}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  helperText={emailError ? "Invalid Email Address" : ""}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
              Send Password Reset Link
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

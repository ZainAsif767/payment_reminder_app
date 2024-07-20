/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  registerWithEmailAndPassword,
  auth,
  loginWithGoogle,
} from "../../firebase/firebase";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { MySwal, toast } from "../utils/swal";
import GoogleIcon from "../../assets/google.svg";
import Copyright from "../utils/Copyright";

const defaultTheme = createTheme();
export default function SignUp() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      MySwal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You can now sign in with your credentials.",
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/signin");
      });
    }
    if (error) {
      MySwal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: "An error occurred while registering. Please try again later.",
      });
      console.error("Registration Error: ", error);
    }
  }, [loading, user, error, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      await registerWithEmailAndPassword(name, email, password);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: "An error occurred while registering. Please try again later.",
      });
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      if (loginWithGoogle) {
        toast.fire({ icon: "success", text: "Registered Successfully" });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
              Sign Up
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Box sx={{ flexGrow: 1, height: 1, bgcolor: "divider" }} />
              <Box sx={{ mx: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  or continue with
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, height: 1, bgcolor: "divider" }} />
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              onClick={handleGoogleLogin}
              startIcon={
                <img
                  src={GoogleIcon}
                  alt="icon"
                  style={{ width: 24, height: 24 }}
                />
              }
            >
              Google
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

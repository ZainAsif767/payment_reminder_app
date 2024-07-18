/* eslint-disable no-extra-boolean-cast */
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  loginInWithEmailAndPassword,
  loginWithGoogle,
  sendPasswordReset,
} from "../../firebase/firebase";
import { MySwal, toast } from "../utils/swal";
import GoogleIcon from "../../assets/google.svg";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Payment Reminder App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const res = await loginInWithEmailAndPassword(email, password);

      if (res?.token) {
        toast
          .fire({
            icon: "success",
            title: "Login Successful!",
            timer: 1500,
            timerProgressBar: true,
          })
          .then(() => {
            navigate("/dashboard");
          });
      } else {
        toast.fire({
          icon: "error",
          text: "Invalid credentials. Please try again.",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred during login. Please try again later.",
      });
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordReset(email);
      toast.fire({
        icon: "success",
        text: "Reset Password Link sent!",
        timerProgressBar: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      if (loginWithGoogle) {
        toast.fire({ icon: "success", text: "Logged In successfully" });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url("../../../public/sign-in-bg.png")',
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "left",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                sx={{ mt: 3, mb: 1 }}
              >
                Sign In
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
              <Grid container>
                <Grid item xs>
                  <Link variant="body2" onClick={handleForgotPassword}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

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
import React from "react";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;

    if (!email) {
      toast.fire("", "Please Enter a valid email", "error");
      return;
    }

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
    } catch (err) {
      console.error(err);
      toast.fire({
        icon: "error",
        text: "something went wrong, try again",
        timerProgressBar: true,
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" sx={{ height: "100vh" }}>
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
            Forgot Password ?
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
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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

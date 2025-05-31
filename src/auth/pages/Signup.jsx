import { Button, TextField, Typography, Container, Box } from "@mui/material";
// import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/context/AuthContext";
import { SignupSchema } from "../../utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../auth/services/authService";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { t } from "i18next";

export default function SignUpPage() {
  const { authState, authDispatch } = useAuth();
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const { email, password } = data;
    console.log("Form submitted:", email, password);
    const result = await registerUser(authDispatch, { email, password });
    if (result.success) {
      if (result.user) {
        console.log("Registration successful, user data:", result.user);
      } else if (result.requiresConfirmation) {
        console.log("Registration initiated, email confirmation required.");
      }
    } else if (result.error) {
      // The error is already dispatched to global state by registerUser
      // but you might want to show a specific message on the form too.
      // setServerError(result.error); // This is now handled by authState.error
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={2} borderRadius={2}>
        <Typography variant="h5" mb={3}>
          {t("Sign Up")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            required
            fullWidth
            label={t("Email")}
            type="email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            required
            fullWidth
            label={t("Password")}
            type="password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            required
            fullWidth
            label={t("Confirm Password")}
            type="password"
            margin="normal"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            disabled={authState.isLoading}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            {authState.isLoading ? t("Registering...") : t("Register")}
          </Button>
        </form>
        <Link to={"/login"}>
          <Typography mt={2} variant="body2">
            {t("Already have an account?")}
          </Typography>
        </Link>
      </Box>
    </Container>
  );
}

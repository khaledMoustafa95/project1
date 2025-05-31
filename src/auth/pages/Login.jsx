import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../../utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { loginUser } from "../../auth/services/authService"; // Ensure this path is correct
import { AUTH_ACTIONS } from "../../auth/hooks/useAuthReducer";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const { authState, authDispatch } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      // Good practice to set default values
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    authDispatch({ type: AUTH_ACTIONS.CLEAR_ERROR }); // Clear previous errors
    const result = await loginUser(authDispatch, {
      email: data.email,
      password: data.password,
    });
    console.log("Login result:", result);

    if (result.success && result.user) {
      console.log("Navigate to dashboard");
      navigate("/dashboard");
    }
  };
  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={2} borderRadius={2}>
        <Typography variant="h5" mb={3}>
          {t("Sign in")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          <Button
            disabled={authState.isLoading || isSubmitting}
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            {authState.isLoading || isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("Sign in")
            )}
          </Button>
        </form>
        <Link to={"/signup"}>
          <Typography mt={2} variant="body2">
            {t("Don't have an account? Sign up")}
          </Typography>
        </Link>
      </Box>
    </Container>
  );
}

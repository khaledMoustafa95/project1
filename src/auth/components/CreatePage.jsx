import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, TODO_STATUSES } from "../../utils/validators";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Alert,
} from "@mui/material";

import { useAuth } from "../../auth/context/AuthContext";
import { createTodo } from "../../auth/services/todoService";

const CreatePage = () => {
  const {
    control,
    register,
    reset,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "pending",
      due_date: null,
    },
  });
  const { authState } = useAuth();

  const [pageError, setPageError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const handleActualFormSubmit = async (data) => {
    if (!authState.user) {
      setPageError("You must be logged in to create a todo.");
      return;
    }

    setPageError(null);
    setSuccessMessage(null);

    const dataToSubmit = {
      ...data,
      description: data.description === "" ? null : data.description,
      due_date: data.due_date || null, 
    };

    try {
      const { data: newTodo, error: createError } = await createTodo(
        dataToSubmit,
        authState.user.id
      );

      if (createError) {
        throw createError;
      }

      setSuccessMessage(`Todo "${newTodo.name}" created successfully!`);
      reset(); // Clear the form fields to their defaultValues
     
    } catch (err) {
      console.error("Failed to create todo:", err);
      setPageError(
        err.message || "An unexpected error occurred. Please try again."
      );
    }
 
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleActualFormSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 4,
        width: "800px",

        p: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
      }}
    >
      <Typography variant="h6">{"Create New Todo"}</Typography>
      {pageError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setPageError(null)}
        >
          {pageError}
        </Alert>
      )}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        required
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isSubmitting}
      />

      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        disabled={isSubmitting}
      />

      <FormControl fullWidth error={!!errors.status} disabled={isSubmitting}>
        <InputLabel id="status-label">Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              labelId="status-label"
              label="Status"
              {...field} // Spread field props (value, onChange, onBlur)
            >
              {TODO_STATUSES.map((statusValue) => (
                <MenuItem key={statusValue} value={statusValue}>
                  {statusValue.charAt(0).toUpperCase() +
                    statusValue.slice(1).replace("-", " ")}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.status && (
          <Typography color="error" variant="caption">
            {errors.status.message}
          </Typography>
        )}
      </FormControl>

      <TextField
        label="Due Date"
        type="date"
        variant="outlined"
        fullWidth
        {...register("due_date")}
        error={!!errors.due_date}
        helperText={errors.due_date?.message}
        disabled={isSubmitting}
      />

      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Add Todo"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePage;

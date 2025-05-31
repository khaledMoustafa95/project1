// src/pages/AllTodosPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Modal,
  Button,
  Chip,
} from "@mui/material";
import TodoCard from "./TodoCard";
import { useTodos } from "../hooks/todosReducer";
import { useAuth } from "../context/AuthContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 450, md: 500 },
  bgcolor: "background.paper",
  border: "1px solid #ddd",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
};

const ViewPage = () => {
  const { authState } = useAuth();
  const { state, actions } = useTodos();
  const navigate = useNavigate();

  const { todos, isLoading, error, viewingTodo } = state;
  const {
    handleDeleteTodo,
    handleViewTodo,
    handleCloseViewModal,
    retryFetch,
    clearError,
  } = actions;

  const handleEditTodo = (todo) => {
    navigate(`/dashboard/todos/${todo.id}/edit`); // Example route
  };

  // Initial auth check before hook potentially runs fetch
  if (!authState.user && !authState.isLoading) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Please log in to view your todos.
        </Alert>
      </Container>
    );
  }
  // If auth is loading, useTodos hook will also likely be in its initial loading state or waiting for user.
  // The isLoading from useTodos will handle the display once authState.user is available.

  if (isLoading && todos.length === 0) {
    // Show loader only if no todos are displayed yet
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography>Loading todos...</Typography>
      </Container>
    );
  }

  // Display error, but allow retry or clearing
  if (error) {
    return (
      <Container sx={{ mt: 2 }}>
        <Alert
          severity="error"
          action={
            <>
              <Button color="inherit" size="small" onClick={retryFetch}>
                RETRY
              </Button>
              <Button color="inherit" size="small" onClick={clearError}>
                DISMISS
              </Button>
            </>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          My Todos (Reducer)
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/todos/create")}
        >
          Create New Todo
        </Button>
      </Box>

      {todos.length === 0 && !isLoading ? ( // Check isLoading again to avoid flash of "no todos"
        <Typography sx={{ mt: 3, textAlign: "center" }}>
          You have no todos yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {todos.map((todo) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={todo.id}
              sx={{ display: "flex" }}
            >
              <TodoCard
                todo={todo}
                onView={handleViewTodo}
                onEdit={handleEditTodo} // Pass the locally defined edit handler
                onDelete={handleDeleteTodo}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for Viewing Todo Details */}
      <Modal
        open={!!viewingTodo}
        onClose={handleCloseViewModal}
        aria-labelledby="view-todo-title"
        aria-describedby="view-todo-description"
      >
        <Box sx={modalStyle}>
          {viewingTodo && (
            <>
              <Typography
                id="view-todo-title"
                variant="h5"
                component="h2"
                gutterBottom
              >
                {viewingTodo.name}
              </Typography>
              <Chip
                label={viewingTodo.status}
                size="small"
                color={
                  viewingTodo.status === "completed"
                    ? "success"
                    : viewingTodo.status === "in-progress"
                    ? "warning"
                    : "info"
                }
                sx={{ mb: 2 }}
              />
              <Typography
                id="view-todo-description"
                sx={{
                  mt: 1,
                  mb: 2,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <strong>Description:</strong>
                <br />
                {viewingTodo.description || "N/A"}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Due Date:</strong>{" "}
                {viewingTodo.due_date
                  ? new Date(viewingTodo.due_date).toLocaleDateString()
                  : "N/A"}
              </Typography>
              <Typography
                sx={{ mt: 1, fontSize: "0.8rem", color: "text.secondary" }}
              >
                Created: {new Date(viewingTodo.created_at).toLocaleString()}
              </Typography>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  onClick={() => {
                    handleEditTodo(viewingTodo);
                    handleCloseViewModal();
                  }}
                  variant="outlined"
                >
                  Edit
                </Button>
                <Button onClick={handleCloseViewModal}>Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ViewPage;

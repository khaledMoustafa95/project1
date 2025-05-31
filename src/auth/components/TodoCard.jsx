import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility"; // View icon

const TodoCard = ({ todo, onView, onEdit, onDelete }) => {
  if (!todo) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "pending":
      default:
        return "info"; // Using 'info' for pending, or 'default'
    }
  };

  return (
    <Card
      sx={{
        minWidth: 800,
        mb: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ wordBreak: "break-word" }}
          >
            {todo.name}
          </Typography>
          <Chip
            label={todo.status}
            color={getStatusColor(todo.status)}
            size="small"
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            wordBreak: "break-word",
            maxHeight: "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {todo.description || "No description available."}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Due:{" "}
          {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "N/A"}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {new Date(todo.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ justifyContent: "flex-end", borderTop: "1px solid #eee", pt: 1 }}
      >
        {onView && (
          <IconButton
            size="small"
            color="primary"
            onClick={() => onView(todo)}
            title="View Details"
          >
            <VisibilityIcon />
          </IconButton>
        )}
        {onEdit && (
          <IconButton
            size="small"
            color="secondary"
            onClick={() => onEdit(todo)}
            title="Edit Todo"
          >
            <EditIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton
            size="small"
            sx={{ color: "error.main" }}
            onClick={() => onDelete(todo.id)}
            title="Delete Todo"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default TodoCard;

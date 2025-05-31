import { useReducer, useEffect, useCallback } from "react"; // Adjust path
import { useAuth } from "../../auth/context/AuthContext"; // Adjust path
import {
  getTodosByUserId,
  deleteTodo as deleteTodoService, // Renamed to avoid conflict
  subscribeToTodoChanges,
} from "../services/todoService"; // Adjust path

export const useTodos = () => {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const { authState } = useAuth();
  const user = authState.user;

  // Fetch Todos
  const fetchTodos = useCallback(async () => {
    if (!user) {
      // If no user, ensure state reflects this (e.g., empty todos, not loading)
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: { todos: [] } });
      return;
    }
    dispatch({ type: actionTypes.FETCH_INIT });
    const { data, error } = await getTodosByUserId(user.id);
    if (error) {
      dispatch({
        type: actionTypes.FETCH_FAILURE,
        payload: { error: error.message || "Failed to fetch todos." },
      });
    } else {
      dispatch({
        type: actionTypes.FETCH_SUCCESS,
        payload: { todos: data || [] },
      });
    }
  }, [user, dispatch]); // dispatch is stable

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (!user) return;

    const handleRealtimePayload = (payload) => {
      console.log("useTodos - Realtime Change received!", payload);
      if (payload.eventType === "INSERT") {
        dispatch({
          type: actionTypes.REALTIME_INSERT,
          payload: { todo: payload.new },
        });
      } else if (payload.eventType === "UPDATE") {
        dispatch({
          type: actionTypes.REALTIME_UPDATE,
          payload: { todo: payload.new },
        });
        // If this update affects the currently viewed todo, update it
        if (state.viewingTodo && state.viewingTodo.id === payload.new.id) {
          dispatch({
            type: actionTypes.SET_VIEWING_TODO,
            payload: { todo: payload.new },
          });
        }
      } else if (payload.eventType === "DELETE") {
        dispatch({
          type: actionTypes.REALTIME_DELETE,
          payload: { id: payload.old.id },
        });
        if (state.viewingTodo && state.viewingTodo.id === payload.old.id) {
          dispatch({ type: actionTypes.CLEAR_VIEWING_TODO });
        }
      }
    };

    const channel = subscribeToTodoChanges(user.id, handleRealtimePayload);
    channel.subscribe((status, err) => {
      if (status === "SUBSCRIBED") {
        console.log("useTodos: Subscribed to Todos channel!");
      }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || err) {
        console.error(
          "useTodos: Realtime subscription error:",
          err || `Status: ${status}`
        );
        dispatch({
          type: actionTypes.FETCH_FAILURE,
          payload: { error: "Realtime connection error." },
        });
      }
    });

    return () => {
      channel
        .unsubscribe()
        .catch((err) => console.error("Error unsubscribing channel:", err));
    };
  }, [user, dispatch, state.viewingTodo]);

  // Action Handlers
  const handleDeleteTodo = useCallback(
    async (todoId) => {
      if (!user) return;

      const { error } = await deleteTodoService(todoId, user.id);
      if (error) {
        dispatch({
          type: actionTypes.DELETE_FAILURE,
          payload: { error: error.message || "Failed to delete." },
        });
      } else {
        dispatch({ type: actionTypes.DELETE_SUCCESS, payload: { id: todoId } });
      }
    },
    [user, dispatch]
  );

  const handleViewTodo = useCallback(
    (todo) => {
      dispatch({ type: actionTypes.SET_VIEWING_TODO, payload: { todo } });
    },
    [dispatch]
  );

  const handleCloseViewModal = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_VIEWING_TODO });
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, [dispatch]);

  return {
    state, // { todos, isLoading, error, viewingTodo }
    actions: {
      handleDeleteTodo,
      handleViewTodo,
      handleCloseViewModal,
      retryFetch: fetchTodos, // Expose a way to retry fetching
      clearError,
    },
  };
};

export const initialState = {
  todos: [],
  isLoading: true,
  error: null,
  viewingTodo: null,
};

export const actionTypes = {
  FETCH_INIT: "FETCH_INIT",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",
  REALTIME_INSERT: "REALTIME_INSERT",
  REALTIME_UPDATE: "REALTIME_UPDATE",
  REALTIME_DELETE: "REALTIME_DELETE",
  DELETE_INIT: "DELETE_INIT", // For optimistic UI or specific delete loading
  DELETE_SUCCESS: "DELETE_SUCCESS", // To handle immediate UI update after delete action
  DELETE_FAILURE: "DELETE_FAILURE",
  SET_VIEWING_TODO: "SET_VIEWING_TODO",
  CLEAR_VIEWING_TODO: "CLEAR_VIEWING_TODO",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const sortTodos = (todos) =>
  todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

export const todosReducer = (state, action) => {
  console.log("Reducer Action:", action.type, action.payload); // For debugging
  switch (action.type) {
    case actionTypes.FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        todos: sortTodos(action.payload.todos || []),
        error: null,
      };
    case actionTypes.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case actionTypes.REALTIME_INSERT:
      if (state.todos.find((todo) => todo.id === action.payload.todo.id)) {
        return state;
      }
      return {
        ...state,
        todos: sortTodos([action.payload.todo, ...state.todos]),
      };
    case actionTypes.REALTIME_UPDATE:
      return {
        ...state,
        todos: sortTodos(
          state.todos.map((todo) =>
            todo.id === action.payload.todo.id ? action.payload.todo : todo
          )
        ),
        viewingTodo:
          state.viewingTodo?.id === action.payload.todo.id
            ? action.payload.todo
            : state.viewingTodo,
      };
    case actionTypes.REALTIME_DELETE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
        viewingTodo:
          state.viewingTodo?.id === action.payload.id
            ? null
            : state.viewingTodo,
      };
    case actionTypes.DELETE_INIT: // Optional: can set a specific loading state for the item being deleted
      return {
        ...state,
        isLoading: true, // Or a more specific loading flag like isDeletingTodoId: action.payload.id
        error: null,
      };
    case actionTypes.DELETE_SUCCESS: // Optimistic update or confirmation
      return {
        ...state,
        isLoading: false, // Reset global loading if DELETE_INIT set it
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
        viewingTodo:
          state.viewingTodo?.id === action.payload.id
            ? null
            : state.viewingTodo,
      };
    case actionTypes.DELETE_FAILURE:
      return {
        ...state,
        isLoading: false, // Reset global loading if DELETE_INIT set it
        error: action.payload.error,
      };
    case actionTypes.SET_VIEWING_TODO:
      return {
        ...state,
        viewingTodo: action.payload.todo,
      };
    case actionTypes.CLEAR_VIEWING_TODO:
      return {
        ...state,
        viewingTodo: null,
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

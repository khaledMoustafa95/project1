import { supabase } from "./supabaseClient";

const TODOS_TABLE = "todos";
export const createTodo = async (todoData, userId) => {
  if (!userId) {
    return {
      data: null,
      error: { message: "User ID is required to create a todo." },
    };
  }
  const dataToInsert = {
    ...todoData,
    user_id: userId,
  };
  return supabase.from(TODOS_TABLE).insert(dataToInsert).select().single();
};
export const deleteTodo = async (todoId) => {
  // userId isn't directly in the query here as RLS should handle ownership.
  if (!todoId) {
    return {
      data: null,
      error: { message: "Todo ID is required for deletion." },
    };
  }
  return supabase.from(TODOS_TABLE).delete().eq("id", todoId);
};
export const getTodoById = async (todoId) => {
  if (!todoId) {
    return { data: null, error: { message: "Todo ID is required." } };
  }
  return supabase
    .from(TODOS_TABLE)
    .select("*")
    .eq("id", todoId)

    .single();
};
export const subscribeToTodoChanges = (userId, callback) => {
  if (!userId) {
    console.error("User ID is required for real-time subscription.");

    return { subscribe: () => {}, unsubscribe: () => {} };
  }
  const channelName = `todos-user-${userId}`;
  const channel = supabase.channel(channelName).on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: TODOS_TABLE,
      filter: `user_id=eq.${userId}`,
    },
    callback
  );
  return channel;
};
export const getTodosByUserId = async (userId) => {
  if (!userId) {
    return {
      data: null,
      error: { message: "User ID is required to fetch todos." },
    };
  }
  return supabase
    .from(TODOS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
};

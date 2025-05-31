import { z } from "zod";
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const TODO_STATUSES = ['pending', 'in-progress', 'completed'];
const todoStatusEnum = z.enum(TODO_STATUSES);

export const todoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(150, { message: "Name must be 150 characters or less" }),
  description: z.string().max(500, { message: "Description must be 500 characters or less" }).optional().or(z.literal('')), // Allows empty string, which we can treat as null later
  status: todoStatusEnum,
 
  due_date: z.string().optional().nullable().transform(val => val === "" ? null : val),
});
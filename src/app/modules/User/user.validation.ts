import z from "zod";
import { USER_ROLE, USER_STATUS } from "./user.constant";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Name is required",
    }),
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]),
    email: z
      .string({
        message: "Email is required",
      })
      .regex(emailRegex, {
        message: "Invalid email",
      }),
    password: z.string({
      message: "Password is required",
    }),
    status: z.enum(Object.values(USER_STATUS)).default(USER_STATUS.ACTIVE),
    mobileNumber: z.string().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]).optional(),
    email: z
      .string()
      .regex(emailRegex, { message: "Invalid email" })
      .optional(),
    password: z.string().optional(),
    status: z
      .enum(Object.values(USER_STATUS) as [string, ...string[]])
      .optional(),
    mobileNumber: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};

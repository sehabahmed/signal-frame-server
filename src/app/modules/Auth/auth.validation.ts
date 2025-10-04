import z from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Name is required',
    }),
    email: z.string({
      message: 'Email is required',
    }),
    password: z.string({ message: 'Password is required' }),
    mobileNumber: z.string({ message: 'Mobile number is required' }),
    profilePhoto: z.string(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      message: 'Email is required',
    }),
    password: z.string({ message: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      message: 'Old password is required',
    }),
    newPassword: z.string({ message: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: 'Refresh token is required!',
    }),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
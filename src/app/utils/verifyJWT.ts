/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../errors/AppError";
import { USER_ROLE, USER_STATUS } from "../modules/User/user.constant";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

type UserJWTPayload = {
  _id?: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;
};

export const createToken = (
  jwtPayload: UserJWTPayload,
  secret: Secret,
  expiresIn: string
): string => {
  const options: SignOptions = { expiresIn:  expiresIn as unknown as SignOptions['expiresIn'] };
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string): JwtPayload | Error => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error: any) {
        throw new AppError(401, "You are not authorized!");
    }
}
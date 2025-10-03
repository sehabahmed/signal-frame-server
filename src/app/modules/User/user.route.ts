import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = express.Router();

export const UserRoutes = router;

router.post(
  "/create-user",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);

router.get("/", UserControllers.getAllUsers);

router.get("/:id", UserControllers.getSingleUser);
